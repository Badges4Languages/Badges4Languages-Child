<?php
/**
 * The template for displaying Teacher Profiling Grid Archive page.
 *
 * Learn more: http://codex.wordpress.org/Template_Hierarchy
 *
 * @package Listify
 */

global $style;

$blog_style = get_theme_mod( 'content-blog-style', 'default' );
$style      = 'grid-standard' == $blog_style ? 'standard' : 'cover';
$sidebar    = 'none' != esc_attr( listify_theme_mod( 'content-sidebar-position', 'right' ) ) && is_active_sidebar( 'widget-area-sidebar-1' );

get_header(); ?>
	<div id="primary" class="container new-passport-container">
		<!-- Toggle button -->
		<button onclick="toggle_passport_form()" class="button button-small" id="filter-button">Add new Teacher Profiling Grid</button>

		<!-- Add a new PG form -->
		<div id="add-passport-form">

			<h1>New Teacher Profiling Grid</h1>

			<div id="error-content">

			</div>

			<form action="" id="new-teacher-PG-form" method="POST">
		        <label for="passportTitle">Title : </label>
		 
		        <input type="text" name="teacherPGTitle" id="teacherPGTitle" class="required" value="<?php if ( isset( $_POST['teacherPGTitle'] ) ) echo $_POST['teacherPGTitle']; ?>" />
			 	
			 	<?php 
				if( is_plugin_active( "open-badges-framework/open-badges-framework.php" ) ) {
					// Display the children of the right PARENT
				    $parents = apply_filters( 'plugin_get_sub', $parents );
				    ?>
			        <label for="teacherPGLanguage">Language : </label>
			 
			        <select name="teacherPGLanguage" id="teacherPGLanguage" class="required">
				    	<option selected="true" disabled="disabled">Select</option>
					    <?php
						    foreach ((array)$parents['most-important'] as $language) {
						    	echo '<option value="' . $language->term_id . '">' . $language->name . '</option>';
						    }
					    ?>
				    </select>
				<?php } ?>
				    
		        <input type="hidden" name="user" id="user" value="<?php echo get_current_user_id(); ?>" />
		 
		        <button type="submit" class="button button-small passport-button">Save Teacher Profiling Grid</button>	 
			</form>

		</div>
	</div>

	<div <?php echo apply_filters( 'listify_cover', 'page-cover' ); ?>>
		<h1 class="page-title cover-wrapper">Teacher Profiling Grid</h1>
	</div>

	<div id="primary" class="container">
		<div class="row content-area">

			<?php if ( 'left' == esc_attr( listify_theme_mod( 'content-sidebar-position', 'right' ) ) ) : ?>
				<?php get_sidebar(); ?>
			<?php endif; ?>

			<main id="main" class="site-main col-xs-12 <?php if ( $sidebar ) : ?> col-sm-7 col-md-8<?php endif; ?>" role="main">

				<?php if ( 'default' != $blog_style ) : ?>
				<div class="blog-archive blog-archive--grid <?php if ( $sidebar ) : ?> blog-archive--has-sidebar<?php endif; ?>" data-columns>
					<?php add_filter( 'excerpt_length', 'listify_short_excerpt_length' ); ?>
				<?php endif; ?>

				<?php
				while ( have_posts() ) :
					the_post();
					//Display the PG of only the logged in user
					if( get_current_user_id() == get_post_meta( get_the_ID(),'_teacher',true ) ){
						// Display the custom template archive-passport-content.php (because it's exactly the same than for passports)
						get_template_part( 'templates/archives/archive-passport-content' );
					}
				endwhile;

				// Display the pagination template (if there are more than 5 results)
				get_template_part( 'content', 'pagination' ); ?>

				<?php if ( 'default' != $blog_style ) : ?>
					<?php remove_filter( 'excerpt_length', 'listify_short_excerpt_length' ); ?>
					</div>
				<?php endif; ?>

				<?php
					// Display the pagination template
					get_template_part( 'content', 'pagination' );
				?>

			</main>

		</div>
	</div>

<?php get_footer(); ?>
