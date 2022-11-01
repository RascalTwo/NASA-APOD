# [NASA Astronomy Picture of the Day](https://rascaltwo.github.io/NASA-APOD/)

[![pages-build-deployment](https://github.com/RascalTwo/NASA-APOD/actions/workflows/pages/pages-build-deployment/badge.svg)](https://rascaltwo.github.io/NASA-APOD/)

Show the Astronomy Picture of the Day for any day of your choice, and random days using the [NASA APOD API](https://github.com/nasa/apod-api)

![picture of April 11th 2022](https://user-images.githubusercontent.com/9403665/199157080-28bbd78d-134d-4b9a-937d-e573ad835cf6.png)

## How It's Made

**Tech used:** HTML, CSS, JavaScript, NASA APOD API

Powered by the NASA Astronomy Picture of the Day API, this project allows you to view the Astronomy Picture of the Day for any day of your choice, and random days, with the key being stored in local storage for those who choose to save it.

Rendering non-image media types is done via the `<object />` tag, with CORs-blocked media requiring external navigation.

Finally the bordered accordion was achieved by aligning via CSS and toggling the opened state of a `<details />` and the opening button.

## Optimizations

The only place this project falls short is the third party media resources that CORs blocks, which could be replaced by images previewing the content if I implemented a backend.

## Lessons Learned

Handling non-images media types that could vary from videos, YouTube links, and even links to websites was a challenge, but the `<object />` tag was the perfect solution.
