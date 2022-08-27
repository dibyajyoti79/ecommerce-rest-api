// const catchAyncError = (theFunc) => {
//     return async (req, res, next) => {
//         try {
//             await theFunc(req, res, next);
//         } catch (error) {
//             next(error);
//         }
//     }
// }

// module.exports = catchAyncError;

// alternative way to do it:
module.exports = (theFunc) => (req, res, next) => {
    Promise.resolve(theFunc(req, res, next)).catch(next);
};