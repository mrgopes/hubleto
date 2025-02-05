<?php

namespace HubletoApp\Community\Products\Controllers;

class Suppliers extends \HubletoMain\Core\Controller {

  public function getBreadcrumbs(): array
  {
    return array_merge(parent::getBreadcrumbs(), [
      [ 'url' => 'products', 'content' => $this->translate('Products') ],
      [ 'url' => '', 'content' => $this->translate('Product Suppliers') ],
    ]);
  }

  public function prepareView(): void
  {
    parent::prepareView();
    $this->setView('@app/community/Products/Views/Suppliers.twig');
  }
}