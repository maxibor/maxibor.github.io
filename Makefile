.PHONY: build serve clean preview

# Build the site and generate the search index
build:
	hugo --minify
	npx pagefind --site public

# Serve the site locally with live reload (does not include search index)
serve:
	hugo serve

# Build the site and serve the generated static files locally (to test search)
preview: build
	npx http-server public -c-1

# Clean up generated files
clean:
	rm -rf public
	rm -rf resources/_gen
