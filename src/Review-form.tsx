
type SelectOption = {
  label: string;
  value: string;
};
/**
 * @returns an array with all names of ingridients with the given @type
 */
function makeOptions(
  type: IngredientType,
  inventory: Inventory
): SelectOption[] {
  return Object.keys(inventory)
    .filter((name) => inventory[name].type === type)
    .map((name) => ({
      value: name,
      label: `${name}, ${inventory[name].price} kr`,
    }));
}

type PropsType = {
  inventory: Inventory;
  addSalad: (salad: Salad) => void;
};

function ComposeSalad() {
  const { inventory,addSalad } = useOutletContext<PropsType>();
  const [foundation, setFoundation] = useState<SelectOption | null>(null);
  const [protein, setProtein] = useState<SelectOption | null>(null);
  const [extra, setExtra] = useState<PartialInventory>({});
  const [dressing, setDressing] = useState<SelectOption | null>(null);
  const [showError, setShowError] = useState(false);
  const foundationNames = makeOptions('foundation', inventory);
  const proteinNames = makeOptions('protein', inventory);
  const extraNames = makeOptions('extra', inventory);
  const dressingNames = makeOptions('dressing', inventory);
  const navigate = useNavigate();
  function toggleExtra(name: string, checked: boolean) {
    
      if (checked) {
        setExtra(
          (prev) => ({ ...prev, [name]: inventory[name] }));
      } else {
        const {[name]: _removed, ...rest} = extra;
        setExtra(rest)
      }

  }

  function handleSubmit(event: React.SubmitEvent) {
    event.preventDefault();
    
    
    if(foundation && protein && dressing && Object.entries(extra).length >= 2){
    let salad = new Salad();
     salad = salad.add(foundation.value, inventory[foundation.value]);
     salad = salad.add(protein.value, inventory[protein.value]);
     salad = salad.add(dressing.value, inventory[dressing.value]);
      Object.entries(extra).forEach(([name, info]) => {
        salad = salad.add(name, info);
      })
      addSalad(salad);
      navigate(`/view-cart/new/${salad.uuid}`)
    

    setFoundation(null);
    setProtein(null);
    setExtra({});
    setDressing(null);
    setShowError(false)
  } else {
    setShowError(true)
  }
  }
  return (
    <form onSubmit={handleSubmit} noValidate>
      <Card>
      <div> 
      <h1 className="text-2xl font-bold ">Komponera en sallad</h1>
      Välj de ingredienser som ingår i salladen.
      </div>
      <SelectIngredient
        label="Välj bas"
        value={foundation}
        options={foundationNames}
        onValueChange={setFoundation}
        showError={showError}
      />
      <SelectIngredient
        label="Välj protein"
        value={protein}
        options={proteinNames}
        onValueChange={setProtein}
        showError={showError}
      />
      <SelectExtras
        label="Välj minst två extra ingredienser."
        options={extraNames}
        onToggle={toggleExtra}
        inventory={inventory}
        extra={extra}
        showError={showError}
      />
      <SelectIngredient
        label="Välj dressing"
        value={dressing}
        options={dressingNames}
        onValueChange={setDressing}
        showError={showError}
      />

      <div className="font-normal text-right tabular-nums ">
      <Button type="submit">Lägg till i varukorgen</Button>
      
      </div>
      </Card>
    </form>
  );
}

type SelectIngredientType = {
  label: string;
  value: SelectOption | null;
  onValueChange: (value: SelectOption | null) => void;
  options: SelectOption[];
  showError: boolean;
};
function SelectIngredient({
  label,
  value,
  onValueChange,
  options,
  showError,
}: SelectIngredientType) {
  const invalid = showError && !value;
  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor={label} className="text-base font-semibold">
        {label}
        <span aria-hidden="true" className="-ml-1.5">
          *
        </span>
      </FieldLabel>
      <Select
        id={label}
        name={label}
        value={value}
        required
        onValueChange={onValueChange}
      >
        <SelectTrigger aria-invalid={invalid} className="w-sm">
          <SelectValue placeholder="gör ett val" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem value={option} key={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {invalid && <FieldError>Gör ett val.</FieldError>}
    </Field>
  );
}
type SelectExtrasType = {
  label: string;
  onToggle: (value: string, checked: boolean) => void;
  options: SelectOption[];
  inventory: Inventory;
  extra: PartialInventory;
  showError: boolean
};
function SelectExtras({
  label,
  onToggle,
  options,
  extra,
  showError,
}: SelectExtrasType) {
  return (
    
    
    <div className="grid grid-cols-4 gap-2 mb-4">
      <fieldset className="text-base font-semibold -mb-1">{label}</fieldset>
          {options.map((option) => (
            <div key={option.value} className="flex items-center gap-2">
            <Checkbox
              id={option.value}
              checked = {option.value in extra}
              onCheckedChange={(checked) =>
                onToggle(option.value, checked === true)
              }
            />
            <Label htmlFor={option.value}>{option.label}</Label>
            </div>
            ))}
            {showError && Object.entries(extra).length < 2 &&(
          <FieldError>
            För få extra ingredienser
          </FieldError>
        )}
  </div>
  );
}

export default ComposeSalad;
