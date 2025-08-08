import { useEffect, useState } from 'react';
import { set } from 'sanity';
import { Button, Card, Stack, Text } from '@sanity/ui';
import type { StringInputProps } from 'sanity';

export default function UuidFieldComponent(props: StringInputProps) {
  const { value, onChange, readOnly } = props;
  const [isGenerating, setIsGenerating] = useState(false);

  const generateId = () => {
    // Simple timestamp-based ID for testing
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    const id = `job_${timestamp}_${random}`;
    console.log('Generated ID:', id);
    return id;
  };

  const handleGenerateClick = () => {
    if (!readOnly) {
      setIsGenerating(true);
      const id = generateId();
      onChange(set(id));
      setIsGenerating(false);
    }
  };

  return (
    <Card padding={3} radius={2} shadow={1} tone="primary">
      <Stack space={3}>
        <Text weight="semibold" size={1}>Job ID:</Text>
        
        {value ? (
          <Card padding={2} radius={1} tone="default" border>
            <Text font="mono" size={1}>
              {value}
            </Text>
          </Card>
        ) : (
          <Card padding={2} radius={1} tone="caution" border>
            <Text size={1} muted>
              No ID generated yet
            </Text>
          </Card>
        )}
        
        {!readOnly && (
          <Button
            mode="ghost"
            tone="primary"
            onClick={handleGenerateClick}
            disabled={isGenerating}
            text={isGenerating ? 'Generating...' : 'Generate UUID'}
          />
        )}
        
        {value && (
          <Text size={0} muted>
            This ID is automatically generated and cannot be changed
          </Text>
        )}
      </Stack>
    </Card>
  );
}
