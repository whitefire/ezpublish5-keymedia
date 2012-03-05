{if eq(is_set($attribute_base), false())}
    {def $attribute_base='ContentObjectAttribute'}
{/if}
{def $handler = $attribute.content
    $image = $handler.image }

{run-once}
    {ezcss( array('jquery.jcrop.css', 'keymedia.css') )}
    {ezscript( array(
        'libs/handlebars.js',
        'libs/jquery.jcrop.min.js',

        'keymedia/ns.js',
        'keymedia/Attribute.js',
        'keymedia/Image.js',

        'keymedia/views/scaled_version.js',
        'keymedia/views/scaler.js',
        'keymedia/views/browser.js',
        'keymedia/views/keymedia.js',

        'keymedia/views/Modal.js',
        'keymedia/views/Upload.js',
        'keymedia/views/Tagger.js',
    ) )}
    {include uri="design:parts/js_templates.tpl"}
{/run-once}
<div class="attribute-base" data-attribute-base='{$attribute_base}' data-id='{$attribute.id}' data-handler='KeyMedia.views.KeyMedia'
    data-bootstrap='{$image.data|json}' data-version='{$attribute.version}'>
    <section class="image-container">
        <div class="keymedia-preview current-image">
            {include uri="design:parts/keymedia/preview.tpl" attribute=$attribute}
        </div>
        <div class="keymedia-interactions actions">
            {include uri="design:parts/keymedia/interactions.tpl" attribute=$attribute base=$attribute_base}
        </div>
</div>
