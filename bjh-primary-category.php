<?php
/**
 * Plugin Name: Primary Taxonomy Term for Gutenberg
 * Plugin URI:  https://github.com/brianjohnhanna/wp-primary-taxonomy-term-gutenberg
 * Description: Adds admin UI for selecting a primary taxonomy term
 * Version:     0.1
 * Author:      Brian John Hanna
 * Author URI:  http://brianjohnhanna.com/
 * License:     GPL2
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: bjh-primary-category
 */

namespace BJH;

class Primary_Category {

    protected $taxonomies;

    public function __construct() {
        $primary_term_taxonomies = apply_filters('bjh/primary_term_taxonomies', ['category']);
        $all_taxonomies = get_taxonomies([], 'names');
        $this->taxonomies = array_intersect($primary_term_taxonomies, $all_taxonomies);
    }

    /**
     * Apply all hooks necessary to run
     *
     * @return void
     */
    public function init() {
        add_action(
            'enqueue_block_editor_assets',
            [ $this, 'enqueue_script' ]
        );

        $primary_term_taxonomies = apply_filters('bjh/primary_term_taxonomies', ['category']);
        
        // Ensure we have valid taxonomies only
        $all_taxonomies = get_taxonomies([], 'names');
        $taxonomies = array_intersect($primary_term_taxonomies, $all_taxonomies);

        foreach ( $this->taxonomies as $taxonomy ) {
            register_post_meta( 
                'post', 
                "bjh_primary_$taxonomy", 
                [
                    'type' => 'integer',
                    'description' => "The primary $taxonomy assigned to a post",
                    'single' => true,
                    'show_in_rest' => true
                ]
            );
        }
              
    }

    /**
     * Add the script to the block editor
     *
     * @return void
     */
    public function enqueue_script() {
        wp_register_script(
            'bjh-primary-category-gb', 
            plugins_url( 'dist/main.js', __FILE__ ), 
            [ 'wp-blocks', 'wp-element', 'wp-components' ]
        );
        wp_localize_script('bjh-primary-category-gb', '_bjhpc', [
            'nonce' => wp_create_nonce('wp_rest'),
            'taxonomies' => $this->taxonomies
        ]);
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