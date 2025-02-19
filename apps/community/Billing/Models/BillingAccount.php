<?php

namespace HubletoApp\Community\Billing\Models;

use HubletoApp\Community\Customers\Models\Customer;

use \ADIOS\Core\Db\Column\Lookup;
use \ADIOS\Core\Db\Column\Varchar;

class BillingAccount extends \HubletoMain\Core\Model
{
  public string $table = 'billing_accounts';
  public string $eloquentClass = Eloquent\BillingAccount::class;
  public ?string $lookupSqlValue = '{%TABLE%}.description';

  public array $relations = [
    'SERVICES' => [ self::HAS_MANY, BillingAccountService::class, 'id_billing_account', 'id' ],
    'CUSTOMER' => [ self::BELONGS_TO, Customer::class, 'id_customer', 'id'  ],
  ];

  public function describeColumns(): array
  {
    return array_merge(parent::describeColumns(), [
      'id_customer' => (new Lookup($this, $this->translate("Customer"), Customer::class, 'CASCADE'))->setRequired(),
      'description' => (new Varchar($this, $this->translate("Description")))->setRequired(),
    ]);
  }

  public function describeTable(): \ADIOS\Core\Description\Table
  {
    $description = parent::describeTable();
    $description->ui['title'] = 'Billing Account';
    $description->ui['addButtonText'] = 'Add Billing Account';
    $description->ui['showHeader'] = true;
    $description->ui['showFooter'] = false;
    return $description;
  }
}
