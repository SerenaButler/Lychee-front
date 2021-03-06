/**
 * @description Takes care of every action a photoeditor can handle and execute.
 */

photoeditor = {};

photoeditor.rotate = function (photoID, direction) {
	if (!photoID) return false;
	if (!direction) return false;

	let params = {
		photoID: photoID,
		direction: direction,
	};

	api.post("PhotoEditor::rotate", params, function (data) {
		if (data === false) {
			lychee.error(null, params, data);
		} else {
			photo.json = data;
			photo.json.original_album = photo.json.album;
			if (album.json) {
				photo.json.album = album.json.id;
			}

			let image = $("img#image");
			if (photo.json.sizeVariants.medium2x !== null) {
				image.prop(
					"srcset",
					`${photo.json.sizeVariants.medium.url} ${photo.json.sizeVariants.medium.width}w, ${photo.json.sizeVariants.medium2x.url} ${photo.json.sizeVariants.medium2x.width}w`
				);
			} else {
				image.prop("srcset", "");
			}
			image.prop("src", photo.json.sizeVariants.medium !== null ? photo.json.sizeVariants.medium.url : photo.json.url);
			view.photo.onresize();
			view.photo.sidebar();

			album.updatePhoto(data);
		}
	});
};
