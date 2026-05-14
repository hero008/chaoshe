export function up(img) {
    return new Promise((resolve, reject) => {
        let token = uni.getStorageSync('aToken');
        let filename = img.substring(img.lastIndexOf('/')+1);
        uni.uploadFile({
            url: process.env.VUE_APP_BASE_URL + "v1/upload/image",
            filePath: img,
            name: "file",
            header: { Authorization: "Bearer " + token },
            formData: { name: filename },
            success: (res) => {
                if(res.data){
                    let da = JSON.parse(res.data)
                    if(!da.code) resolve(da.url)
                    else resolve("")
                } else resolve("")
            },
			fail(error) {
				// uni.hideLoading()
				console.log('文件上传失败');
				console.log(error);
				resolve("")
			}
        })
    });
}


