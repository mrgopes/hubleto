<?php

namespace HubletoApp\Community\Settings\Controllers;

class Permissions extends \HubletoMain\Core\Controller {


  public function getBreadcrumbs(): array
  {
    return array_merge(parent::getBreadcrumbs(), [
      [ 'url' => 'settings', 'content' => $this->translate('Settings') ],
      [ 'url' => 'permissions', 'content' => $this->translate('Permissions') ],
    ]);
  }

  public function prepareView(): void
  {
    parent::prepareView();
    $this->setView('@app/community/Settings/Views/Permissions.twig');
  }

}