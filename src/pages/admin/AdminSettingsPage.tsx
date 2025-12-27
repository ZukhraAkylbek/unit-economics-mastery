import { Settings, Shield, Database, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function AdminSettingsPage() {
  const { toast } = useToast();

  const handleClearCache = () => {
    localStorage.clear();
    toast({ title: 'Кеш очищен', description: 'Локальные данные удалены' });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="heading-display text-foreground">
          <span className="text-primary italic">Настройки</span>
        </h1>
        <p className="text-muted-foreground mt-2">Управление системой</p>
      </div>

      <div className="space-y-4">
        {/* System Info */}
        <div className="card-elevated p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Система</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Версия</span>
              <span className="text-foreground">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">База данных</span>
              <span className="text-green-500">Подключена</span>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="card-elevated p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Безопасность</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Доступ через Telegram верификацию. Роли: admin, student.
          </p>
        </div>

        {/* Actions */}
        <div className="card-elevated p-6">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Действия</h3>
          </div>
          <div className="space-y-3">
            <Button variant="outline" onClick={handleClearCache} className="w-full justify-start">
              <Key className="h-4 w-4 mr-2" />
              Очистить локальный кеш
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
