exports.createImage = async ctx => {
    const originalname = ctx.req.file.originalname
    const filename = ctx.req.file.filename

    console.log(originalname)
    console.log(filename)

    ctx.body = { filename, status: 'ok' }
}