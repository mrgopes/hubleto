<?php

namespace CeremonyCrmApp\Modules\Core\Customers\Models;

use CeremonyCrmApp\Modules\Core\Settings\Models\ContactType;

class Contact extends \CeremonyCrmApp\Core\Model
{
  public string $table = 'contacts';
  public string $eloquentClass = Eloquent\Contact::class;
  public ?string $lookupSqlValue = '{%TABLE%}.value';

  public array $relations = [
    'PERSON' => [ self::BELONGS_TO, Person::class, 'id_person', 'id' ],
    'CONTACT_TYPE' => [ self::HAS_ONE, ContactType::class, 'id_contact_type', 'id'],
  ];

  public function columns(array $columns = []): array
  {
    return parent::columns(array_merge($columns, [
      'id_person' => [
        'type' => 'lookup',
        'title' => 'Person',
        'model' => 'CeremonyCrmApp/Modules/Core/Customers/Models/Person',
        'foreignKeyOnUpdate' => 'CASCADE',
        'foreignKeyOnDelete' => 'CASCADE',
        'required' => true,
      ],
      'id_contact_type' => [
        'type' => 'lookup',
        'title' => 'Contact Category',
        'model' => 'CeremonyCrmApp/Modules/Core/Settings/Models/ContactType',
        'foreignKeyOnUpdate' => 'CASCADE',
        'foreignKeyOnDelete' => 'CASCADE',
        'required' => true,
      ],
      'type' => [
        'type' => 'varchar',
        'title' => 'Type',
        'enumValues' => ['email' => 'Email', 'number' => 'Phone Number', 'other' => 'Other'],
        'required' => true,
      ],
      'value' => [
        'type' => 'varchar',
        'title' => 'Value',
        'required' => true,
      ],
    ]));
  }

  public function tableDescribe(array $description = []): array
  {
    $description["model"] = $this->fullName;
    $description = parent::tableDescribe($description);
    $description['title'] = 'Contacts';
    $description['ui']['addButtonText'] = 'Add Company';
    $description['ui']['showHeader'] = true;
    $description['ui']['showFooter'] = false;
    return $description;
  }

  public function prepareLoadRecordQuery(array|null $includeRelations = null, int $maxRelationLevel = 0, $query = null, int $level = 0)
  {
    $query = parent::prepareLoadRecordQuery($includeRelations, 3, $query, $level);
    return $query;
  }
}
