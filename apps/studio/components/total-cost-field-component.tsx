import { TextInput } from "@sanity/ui";
import { useCallback, useEffect, useState } from "react";
import { useFormValue } from "sanity";

interface TotalCostFieldComponentProps {
  value?: string;
  onChange: (event: any) => void;
}

export default function TotalCostFieldComponent({
  value,
  onChange,
}: TotalCostFieldComponentProps) {
  const [calculatedValue, setCalculatedValue] = useState<string>("0.00");
  
  // Get the current form values
  const formValues = useFormValue([]) as any;
  const amount = formValues?.quantityUsed?.amount;
  const unitCost = formValues?.costDetails?.unitCost;

  const calculateTotalCost = useCallback(() => {
    if (amount && unitCost && amount > 0 && unitCost > 0) {
      const total = amount * unitCost;
      setCalculatedValue(total.toFixed(2));
    } else {
      setCalculatedValue("0.00");
    }
  }, [amount, unitCost]);

  useEffect(() => {
    calculateTotalCost();
  }, [calculateTotalCost]);

  return (
    <TextInput
      value={calculatedValue}
      readOnly
      placeholder="Calculated automatically"
      style={{ 
        backgroundColor: "#f5f5f5", 
        cursor: "not-allowed",
        color: "#666"
      }}
    />
  );
}
