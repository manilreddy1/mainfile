
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InterestSelectorProps {
  subject: string;
  onSubjectChange: (value: string) => void;
  academicSubjects: string[];
}

const InterestSelector = ({
  subject,
  onSubjectChange,
  academicSubjects,
}: InterestSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>What are you interested in?</Label>
      <Tabs defaultValue="academic">
        
        <TabsContent value="academic" className="pt-4">
          <Select value={subject} onValueChange={onSubjectChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              {academicSubjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InterestSelector;
