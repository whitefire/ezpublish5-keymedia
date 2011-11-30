<?php
ezote\Autoloader::register();
if (isset($Params) && isset($Params['FunctionName']))
{
    $router = new \ezote\lib\Router;
    $Result = $router->handle('ezr_keymedia', 'key_media', $Params['FunctionName'], $Params['Parameters'])->run();
}
else
{
    $merge = array(
        'ViewList' => array(
            'default_navigation_part' => 'key_media_navigation'
        )
    );
    $definition = ezr_keymedia\modules\key_media\KeyMedia::getDefinition($merge);
    list($Module, $FunctionList, $ViewList) = $definition;
}