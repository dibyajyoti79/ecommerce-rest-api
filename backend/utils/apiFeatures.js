class ApiFeatures{
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }
    
    search(){
        const keyword = this.queryStr.search ? 
        {
            name: {
                $regex: this.queryStr.search,
                $options: 'i'
            },
        }
        : {};
        this.query = this.query.find({...keyword});

        return this;
    }

    filter(){
        const queryCopy = {...this.queryStr};
        const removeFields = ['search', 'page', 'limit'];
        removeFields.forEach(field => delete queryCopy[field]);

        // Filter for price and rating
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    pagination(resultPerPage){ 
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage * (currentPage - 1);
        this.query = this.query.skip(skip).limit(resultPerPage);
        return this;
    }

}

module.exports = ApiFeatures;