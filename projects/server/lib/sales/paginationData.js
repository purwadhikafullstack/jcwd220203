const paginationData = (data, page, limit) => {
    const { count: totalFindDataReal, rows: findData } = data
    const currPage = page ? page : 1
    const totPage = Math.ceil(totalFindDataReal / limit)

    return { totalFindDataReal, findData, currPage, totPage }
}

module.exports = paginationData
