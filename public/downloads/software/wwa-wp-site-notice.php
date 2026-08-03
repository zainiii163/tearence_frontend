<?php
/**
 * Plugin Name: WWA Site Notice
 * Description: Sample WordPress plugin — dismissible site notice banner + settings.
 * Version: 1.0.0
 * Author: Worldwide Adverts
 * License: GPL-2.0+
 *
 * Install: upload to wp-content/plugins/wwa-site-notice/wwa-wp-site-notice.php and activate.
 */

if (!defined('ABSPATH')) {
    exit;
}

function wwa_sn_default_message()
{
    return 'Welcome to Worldwide Adverts — explore jobs, property, and marketplace listings.';
}

function wwa_sn_register_settings()
{
    register_setting('wwa_sn_settings', 'wwa_sn_message', [
        'type' => 'string',
        'sanitize_callback' => 'sanitize_text_field',
        'default' => wwa_sn_default_message(),
    ]);
    register_setting('wwa_sn_settings', 'wwa_sn_enabled', [
        'type' => 'boolean',
        'default' => true,
    ]);
}
add_action('admin_init', 'wwa_sn_register_settings');

function wwa_sn_menu()
{
    add_options_page('WWA Site Notice', 'WWA Site Notice', 'manage_options', 'wwa-site-notice', 'wwa_sn_settings_page');
}
add_action('admin_menu', 'wwa_sn_menu');

function wwa_sn_settings_page()
{
    if (!current_user_can('manage_options')) {
        return;
    }
    ?>
    <div class="wrap">
      <h1>WWA Site Notice</h1>
      <form method="post" action="options.php">
        <?php settings_fields('wwa_sn_settings'); ?>
        <table class="form-table">
          <tr>
            <th scope="row">Enabled</th>
            <td><label><input type="checkbox" name="wwa_sn_enabled" value="1" <?php checked(get_option('wwa_sn_enabled', true)); ?> /> Show banner</label></td>
          </tr>
          <tr>
            <th scope="row">Message</th>
            <td><input type="text" class="regular-text" name="wwa_sn_message" value="<?php echo esc_attr(get_option('wwa_sn_message', wwa_sn_default_message())); ?>" /></td>
          </tr>
        </table>
        <?php submit_button(); ?>
      </form>
    </div>
    <?php
}

function wwa_sn_render_banner()
{
    if (!get_option('wwa_sn_enabled', true)) {
        return;
    }
    $msg = get_option('wwa_sn_message', wwa_sn_default_message());
    echo '<div id="wwa-sn-banner" style="background:#1e3a5f;color:#fff;padding:10px 16px;text-align:center;font:14px/1.4 system-ui,sans-serif">'
        . esc_html($msg)
        . ' <button type="button" onclick="this.parentNode.remove()" style="margin-left:12px;background:#fff;color:#1e3a5f;border:0;border-radius:4px;padding:4px 8px;font-weight:700;cursor:pointer">Dismiss</button>'
        . '</div>';
}
add_action('wp_body_open', 'wwa_sn_render_banner');
add_action('wp_footer', function () {
    if (!did_action('wp_body_open')) {
        wwa_sn_render_banner();
    }
}, 5);

function wwa_sn_shortcode()
{
    ob_start();
    wwa_sn_render_banner();
    return ob_get_clean();
}
add_shortcode('wwa_site_notice', 'wwa_sn_shortcode');
