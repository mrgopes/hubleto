<?php

namespace HubletoApp\Community\Leads\Models\Eloquent;

use HubletoApp\Community\Settings\Models\Eloquent\User;
use \Illuminate\Database\Eloquent\Relations\HasMany;
use \Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class LeadStatus extends \ADIOS\Core\Model\Eloquent
{
  public $table = 'lead_statuses';

}
