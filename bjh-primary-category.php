<?php
/**
 * Plugin Name: Primary Taxonomy Term for Gutenberg
 * Plugin URI:  https://github.com/brianjohnhanna/wp-primary-taxonomy-term-gutenberg
 * Description: Adds admin UI for selecting a primary taxonomy term
 * Version:     0.1
 * Author:      Brian John Hanna
 * Author URI:  https://brianjohnhanna.com
 * License:     GPL2
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: bjh-primary-category
 */

namespace BJH;

class Primary_Category {

    protected $taxonomies;

    public function __construct()
    {
        $primary_term_taxonomies = apply_filters('bjh/primary_term_taxonomies', ['category']);
        $all_taxonomies = get_taxonomies([], 'names');
        $this->taxonomies = array_intersect($primary_term_taxonomies, $all_taxonomies);
    }

    /**
     * Apply all hooks necessary to run
     *
     * @return void
     */
    public function init()
    {
        $this->register_meta();     
        $this->register_assets();

        add_action(
            'enqueue_block_editor_assets',
            [ $this, 'enqueue_assets' ]
        );         
    }

    /**
     * Register meta fields for rest
     *
     * @return void
     */
    public function register_meta()
    {
        foreach ( $this->taxonomies as $taxonomy ) {
            register_post_meta( 
                'post', 
                "_bjh_primary_$taxonomy", 
                [
                    'type' => 'integer',
                    'description' => "The primary $taxonomy assigned to a post",
                    'single' => true,
                    'show_in_rest' => true,
                    // Required for private meta keys
                    // @see https://wordpress.org/gutenberg/handbook/designers-developers/developers/tutorials/metabox/meta-block-2-register-meta/
                    'auth_callback' => function() {
                        return current_user_can('edit_posts');
                    }
                ]
            );
        }
    }

    /**
     * Add the script to the block editor
     *
     * @return void
     */
    public function enqueue_assets() 
    {
        wp_register_script(
            'bjh-primary-category-gb', 
            plugins_url( 'dist/main.js', __FILE__ ),
            ['wp-plugins', 'wp-edit-post']
        );
        wp_localize_script('bjh-primary-category-gb', '_bjhpc', [
            'nonce' => wp_create_nonce('wp_rest'),
            'taxonomies' => $this->taxonomies
        ]);
    }

    public function enqueue_assets()
    {
        wp_enqueue_script('bjh-primary-category-gb');
    }
}

// Blast Off!
add_action(
    'plugins_loaded',
    function() {
        $classname = __NAMESPACE__ . '\\Primary_Category';
        (new $classname)->init();
    }
);