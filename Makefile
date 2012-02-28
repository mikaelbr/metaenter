VERSION=$(shell cat version.txt)
VER = sed s/@VERSION/${VERSION}/
DATE=`git log --pretty=format:'%ad' -1`

HEADER=header.txt

    

build:
	@@echo "Removing old build";

	@@rm -rf dist/ && mkdir dist \
	
	@@echo "Minifying Plugin";

	@@uglifyjs -nc js/jquery.metaenter.js > dist/jquery.metaenter.min.js 

	@@cat $(HEADER) | \
		sed 's/Date:./&'"${DATE}"'/' | \
		$(VER) | \
		cat - dist/jquery.metaenter.min.js > dist/tmp && mv dist/tmp dist/jquery.metaenter.min.js

