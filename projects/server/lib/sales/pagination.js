const pagination = (page, limit) => {
    const _limit = limit ? limit : 2
    const _offset = page > 1 ? (page - 1) * _limit : 0

    return { _limit, _offset }
}

module.exports = pagination
