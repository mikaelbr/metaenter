# Meta Enter

Create a Facebook like input box in seconds. Functionality like toggle submit on enter, new line on shift + enter, and
submit on meta-key + enter. 

## Basic usage

```javascript
$("textarea").metaenter();
```

## Settings
```javascript
{
	useDiv: true, // Use a div instead of textarea
	useFacebookStyle: true, // Use checkbox modus
	useCounter: true, // Show letter counter
	form: false, // Set form to submit. Default false (auto find)
	minHeight: 40, // height in pixels
	maxHeight: 400, // max height in pixels
	checboxLbl: "Activate submit on return" // Text for checkbox if facebook style
}
```
