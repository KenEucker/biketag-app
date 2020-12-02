import '../../public/js/biketag-app-api.js'

class BikeTagV0 {
	/// DEPRECATED V-0.0.1
	target
	targetSelector
	formID
	closeNotification
	createNotification
	getUrlParam
	appendBiketagForm
	sendNotificationEmail
	formatUserName
	onUploadFormSubmit
	renderBikeTag
	biketagImageTemplate
	showImageThumbnail
	setCurrentTagInformation
	showLatestTagImages
	showNewGameImage
	showArchiveTags
	showBikeTagNumber
	addTagPostingEventListeners
	init
  
	constructor() {
		const functionDeprecated = () => {
			throw new Error("DEPRECATED")
		}

		/// DEPRECATED V-0.0.1 MEMBERS
		this.target = NaN
		this.targetSelector = NaN
		this.formID = NaN

		/// DEPRECATED V-0.0.1 FUNCTIONS
		this.closeNotification = functionDeprecated
		this.createNotification = functionDeprecated
		this.getUrlParam = functionDeprecated
		this.appendBiketagForm = functionDeprecated
		this.sendNotificationEmail = functionDeprecated
		this.formatUserName = functionDeprecated
		this.onUploadFormSubmit = functionDeprecated
		this.renderBikeTag = functionDeprecated
		this.biketagImageTemplate = functionDeprecated
		this.showImageThumbnail = functionDeprecated
		this.setCurrentTagInformation = functionDeprecated
		this.showLatestTagImages = functionDeprecated
		this.showNewGameImage = functionDeprecated
		this.showArchiveTags = functionDeprecated
		this.showBikeTagNumber = functionDeprecated
		this.addTagPostingEventListeners = functionDeprecated
		this.init = functionDeprecated
	}
}

class BikeTag extends BikeTagV0 {
	albumHash
	queueHash
  
	constructor() {
		super()
	}

	getTagNumberFromURL(tagNumber) {
		if (!!tagNumber && Number.isInteger(tagNumber)) {
			return tagNumber
		}

		if (!Number.isInteger(tagNumber)) {
			var tagNumberFromQuery = Number.parseInt(this.getUrlParam('tagnumber'))
			var tagNumberFromPath = Number.parseInt(this.getLastOfUrlPath())

			return tagNumberFromPath || tagNumberFromQuery
		} else {
			tagNumber = Number.parseInt(tagNumber)
		}

		return tagNumber
	}

	getTagNumberIndex(tagNumber) {
		var images = imgur.imgurAlbumPictures;
		var tagNumberIndex = ((images.length + 1) - (((tagNumber - (tagNumber % 2) + 1) * 2)));

		var verifyTagNumber = function (index) {
			return index > -1 ? images[index].description.indexOf('#' + tagNumber + ' tag') != -1 : -1
		};
		if (verifyTagNumber(tagNumberIndex)) {
			return tagNumberIndex;
		} else if (tagNumberIndex < (images.length + 1) && verifyTagNumber(tagNumberIndex + 1)) {
			return tagNumberIndex + 1;
		} else if (tagNumberIndex > 0 && verifyTagNumber(tagNumberIndex - 1)) {
			return tagNumberIndex - 1;
		}

		for (var i = 0; i < images.length; ++i) {
			if (verifyTagNumber(i)) {
				tagNumberIndex = i;
			}
		}

		return tagNumberIndex;
	}

	getProofTagNumberIndex(tagNumber) {
		var images = imgur.imgurAlbumPictures;
		var tagNumberIndex = ((images.length + 1) - (((tagNumber - (tagNumber % 2) + 1) * 2)));

		var verifyProofTagNumber = function (index) {
			return images[index].description.indexOf('#' + tagNumber + ' proof') != -1
		};
		if (verifyProofTagNumber(tagNumberIndex)) {
			return tagNumberIndex;
		} else if ((tagNumberIndex + 1 < images.length) && verifyProofTagNumber(tagNumberIndex + 1)) {
			return tagNumberIndex + 1;
		} else if (tagNumberIndex > 0 && verifyProofTagNumber(tagNumberIndex - 1)) {
			return tagNumberIndex - 1;
		}

		for (var i = 0; i < images.length; ++i) {
			console.log(`looking for ${tagNumber} with ${i}`);
			if (verifyProofTagNumber(i)) {
				tagNumberIndex = i;
			}
		}

		return tagNumberIndex
	}

	getBikeTagNumberFromImage(image) {
		let tagNumber

		if (image.description) {
			var split = image.description.split(' ')
			tagNumber = Number.parseInt(split[0].substring(1))

			if (image.description.indexOf('proof') !== -1) {
				tagNumber = 0 - tagNumber
			}
		}

		return tagNumber
	}

	getCurrentTagInformation() {
		if (!!this.currentTagInfo) {
			return this.currentTagInfo
		}

		var tagInformation = {
			currentTagNumber: 0,
			hasTag: false,
			currentTag: null,
			hint: null,
			credit: null,
		}

		if (imgur.imgurAlbumPictures.length) {
			tagInformation.currentTag = !!imgur.imgurAlbumPictures[0].description ? imgur.imgurAlbumPictures[0] : (imgur.imgurAlbumPictures.length > 1 ? imgur.imgurAlbumPictures[1] : 0)
		} else if (window.currentBikeTag) {
			tagInformation.currentTag = window.currentBikeTag.image
		}

		if (tagInformation.currentTag) {
			var tagHintSplit = tagInformation.currentTag.description ? tagInformation.currentTag.description.split('(') : []
			var tagHint = tagHintSplit.length > 1 ? tagHintSplit[1].split(')')[0] : ''
			var tagCreditSplit = tagInformation.currentTag.description ? tagInformation.currentTag.description.split('by') : []
			var tagCredit = tagCreditSplit.length ? tagCreditSplit[tagCreditSplit.length - 1] : ''
			var tagNumberSplit = tagInformation.currentTag.description ? tagInformation.currentTag.description.split(' ') : []
			var tagNumberString = tagNumberSplit.length ? tagNumberSplit[0].substr(1) : 0

			tagInformation.hasTag = true
			tagInformation.currentTagNumber = Number(tagNumberString)
			tagInformation.credit = tagCredit
			tagInformation.hint = tagHint
		}
		

		tagInformation.mysteryTagNumber = tagInformation.currentTagNumber + 1

		this.currentTagInfo = tagInformation

		return tagInformation
	}
}

declare var biketag: BikeTag
