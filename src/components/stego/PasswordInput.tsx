import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  showStrength?: boolean;
  className?: string;
}

function calculateStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z\d]/.test(password)) score++;

  if (score <= 1) return { score, label: 'Weak', color: 'text-destructive' };
  if (score <= 2) return { score, label: 'Fair', color: 'text-yellow-500' };
  if (score <= 3) return { score, label: 'Good', color: 'text-primary' };
  return { score, label: 'Strong', color: 'text-primary' };
}

export function PasswordInput({
  value,
  onChange,
  label = 'Encryption Password',
  showStrength = false,
  className,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const strength = calculateStrength(value);

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor="password" className="flex items-center gap-2 text-foreground">
        <Shield className="h-4 w-4 text-primary" />
        {label}
      </Label>
      
      <div className="relative">
        <Input
          id="password"
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter a strong password"
          className="pr-10 font-mono"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>

      {showStrength && value.length > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex-1 flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={cn(
                  'h-1 flex-1 rounded-full transition-colors',
                  i <= strength.score ? 'bg-primary' : 'bg-muted'
                )}
              />
            ))}
          </div>
          <span className={cn('text-xs font-medium', strength.color)}>
            {strength.label}
          </span>
        </div>
      )}

      {value.length > 0 && value.length < 8 && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Password should be at least 8 characters
        </p>
      )}

      {value.length >= 8 && (
        <p className="text-xs text-primary flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Password meets minimum requirements
        </p>
      )}
    </div>
  );
}

