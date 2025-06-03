export async function save (req, res) {
    res.status(200).json({
        message: 'Vector guardado correctamente',
        data: req.body
    })
}
