const imageToBase64 = async (file: File | null | undefined) => {
    if(!file) return null;
    const reader = new FileReader()
    const result = await new Promise((resolve, reject) => {
        try {
            reader.readAsDataURL(file)
            reader.onload = () => {
                const res: string = reader.result as string;
                const base64 = `data:image/jpeg;base64,${res.replace("data:", "").replace(/^.+,/, "")}`;
                resolve(base64)
            }
        } catch (err) {
            reject(err);
        }
    })
    return result as string;
}

export default imageToBase64