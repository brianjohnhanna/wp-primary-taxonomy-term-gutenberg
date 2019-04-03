# Primary Taxonomy Term for WordPress

This WordPress plugin adds a primary category dropdown to the Gutenberg post editor document block. The primary category can be useful for SEO purposes and assist publishers and editors in organizing content effectively.

> Notice: This is currently an exploratory project, and is not yet suggested for production use. Feel free to fork and/or PR if you feel so inclined.

![Edit Screenshot](assets/screenshot-1.jpg "Post Edit Screen")

### Todo

- [x] Selecting additional category should not automatically reset the primary
- [x] Hook into post autosave/save instead of saving on `onchange` event of select
- [ ] Add template functions & implement hooks for displaying primary category on front-end
- [x] Add option to implement for taxonomies other than just categories
- [ ] Add support for custom post types
- [ ] Additional testing
