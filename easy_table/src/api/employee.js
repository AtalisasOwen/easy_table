import request from '../utils/request'

export function getColumns() {
    return request({
        url: '/e/columns',
        method: 'get'
    })
}

export function getEmployeesDetaildByPaging(query) {
    let url = '/employeeDetails?page=' + (query.page - 1) + '&limit=' + query.limit
    if (query.sort) {
        url = url + '&sort=' + query.sort
    }
    return request({
        url: url,
        method: 'get'
    })
}

export function getEmployeesDetailCount() {
    return request({
        url: '/employeeDetails/count',
        method: 'get'
    })
}

export function getEmployeesDetaildByPagingWithFilter(query, filters, logit) {
    let url = '/employeeDetails/filter/' + logit + '?page=' + (query.page - 1) + '&limit=' + query.limit
    if (query.sort) {
        url = url + '&sort=' + query.sort
    }
    return request({
        url: url,
        method: 'post',
        data: filters
    })
}

export function getEmployeesDetaildByPagingWithFilterCount(filters, logit) {
    return request({
        url: '/employeeDetails/filter/count/' + logit,
        method: 'post',
        data: filters
    })
}

export function getEmployeeDetailFieldOptions(field) {
    return request({
        url: '/employeeDetails/filterField/' + field,
        method: 'get'
    })
}

export function getStructureTree() {
    return request({
        url: '/structureTree',
        method: 'get'
    })
}

export function changeEmployeeDetails(data) {
    return request({
        url: '/employeeDetails/' + data.employeeId,
        method: 'put',
        data: data
    })
}
