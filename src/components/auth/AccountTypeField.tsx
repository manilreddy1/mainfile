
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface AccountTypeFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const AccountTypeField = ({ value, onChange }: AccountTypeFieldProps) => {
  return (
    <div className="space-y-4">
      <Label>I want to register as a:</Label>
      <RadioGroup 
        defaultValue="student" 
        className="flex gap-4" 
        value={value}
        onValueChange={onChange}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="student" id="student" />
          <Label htmlFor="student" className="cursor-pointer">Student</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="teacher" id="teacher" />
          <Label htmlFor="teacher" className="cursor-pointer">Teacher</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default AccountTypeField;
