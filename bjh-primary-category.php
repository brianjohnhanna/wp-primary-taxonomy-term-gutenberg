<?php
/**
 * Plugin Name: Primary Category for Gutenberg
 */

namespace BJH;

class Primary_Category {

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

        register_post_meta( 
            'post', 
            '_bjh_primary_category', 
            [
                'type' => 'integer',
                'description' => 'The primary category assigned to a post',
                'single' => true
            ]
        );
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
        wp_localize_script('bjh-primary-category-gb', 'bjhpc', wp_create_nonce('wp_rest'));
        wp_enqueue_script('bjh-primary-category-gb');
    }
}

function _bjhpc_run_plugin() {
    $classname = __NAMESPACE__ . '\\Primary_Category';
    (new $classname)->init();
}

// Blast Off!
_bjhpc_run_plugin();