# StereoPhoto Prototype

## Components

- Gallery
	- ActionList
		- TakePhotoButton
	- PictureList (scrollable)
		- PictureItem
			- MenuList
			- DeleteAction
			- EditAction

- EditPhoto
	- LeftPicture
	- RightPicture
	- MenuLayer
		- SaveButton
		- CancelButton

- ViewPhoto
	- Picture
	- MenuLayer
		- EditButton
		- GalleryButton
		- PreviousPictureButton
		- NextPictureButton
		- DeleteButton
		- ShareButton


## Actions

### Take Photo

* User is on GalleryPage or any page displaying the TakePhotoButton
* User clicks on the TakePhotoButton. 
* A TakeLeftPhotoInstructionPage is displayed with an animation explaining the 
idea of taking stereoscopic pictures with one camera
* LeftPhoto is taken
* A TakeRightPhotoInstructionPage is displayed with an information "move 
camera to the right" 
* RightPhoto is taken
* App switches to EditPage

### Editing Photo

* LeftPhoto and RightPhoto are displayed next to each other.
* User positions the images on the screen
* User might "retake" a phot
* User clicks SaveButton
* App switches to GalleryPage

### View Gallery

* StereoList is displayed with StereoPhoto represented by its miniature.
* User might scroll through the list
* User might click on a miniature and corresponding ViewPage is displayed.

### View Photo

* A rendered image of the StereoPhoto is displayed in *full screen* mode.
* User might switch to next/prebious StereoPhoto by swiping left and right
* A touch on the picture switches on and off the MenuLayer containing:
	- EditButton
	- GalleryButton
	- PreviousPictureButton
	- NextPictureButton
	- DeleteButton
	- ShareButton

### Saving Photo

StereoPhoto is saved in device's storage. At the moment of the save a miniature 
and rendered stereo is created and saved together with the metadata.

### Sharing Photo

One should consider sharing the photo between StereoPhoto users. 
Sharing exported PNG should be possible via standard platform image sharing 
system. This would allow to send to device's main gallery and to social
networking sites.

### (CONSIDERED) User Accounts

User Account would be useful for:

- Sharing betweeen Users
- Backing up the photos
- Public image sharing
