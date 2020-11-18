require("dotenv").config(); 
const DOMAIN = process.env.DOMAIN;

//send paginated JSON courses back to the user
//query: part of a course number or title to search for
function paginateResults(res, csCourses, query = "", page = 1, limit = 10) {
    checkParams(page, limit);
    query = query.toLowerCase();
    let selectedCourses = query
        ? csCourses.filter((course) => course.title.toLowerCase().includes(query) || course.number.includes(query)) //user searching for specific courses
        : csCourses; //query unspecified, list all courses
    const total = selectedCourses.length;
    if (total === 0) {
        throw "Resource not found";
    }
    const last = Math.ceil(total / limit); //determine total number of pages
    if (page > last) {
        throw `Requested page is out of bound >_< The last page is ${last}.`;
    }
    const pagination = { page, limit, last, total };
    const links = getLinks(query, page, limit, last);
    //find start and end index for courses to display //double check
    const start = (page - 1) * limit; 
    const end = start + limit >= total 
        ? total //if end index surpass length, set end index as the index of last element
        : start + limit; 
    const data = selectedCourses.slice(start, end);
    res.json({ pagination, links, data, query });    
}

//throw an error if page or limit < 1
function checkParams(page, limit) {
    if (page < 1) {
        throw "Page must be >= 1";
    } else if (limit < 1) {
        throw "Limit must be >= 1";
    }
}

//precondition: page >= 1 and is within range
//return a JSON with link attribute of first, last, next page
function getLinks(query, page, limit, lastPage) {
    const nextPage = page === lastPage ? 0 : page + 1; //if reached the last page, set nextPage to 0
    const prevPage = page - 1; //if requested page is the first page, prevPage is set to 0
    //set up links
    const first = `${DOMAIN}/api/search?query=${query}&page=1&limit=${limit}`;
    const last = `${DOMAIN}/api/search?query=${query}&page=${lastPage}&limit=${limit}`;
    const next = `${DOMAIN}/api/search?query=${query}&page=${nextPage}&limit=${limit}`;
    const prev = `${DOMAIN}/api/search?query=${query}&page=${prevPage}&limit=${limit}`;
    if (nextPage && prevPage) { //requested page is somewhere is the middle
        return { first, last, next, prev };
    } else if (nextPage) { //requested page is 1
        return { first, last, next }
    } else if (prevPage){ //requested page is the last page
        return { first, last, prev }; 
    } else {
        return { first, last };
    }
}

module.exports = { paginateResults };