import { useState, useEffect } from 'react';
import { Users, Coins, TrendingUp, Plus, Search, Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Student {
  id: string;
  telegram: string;
  name: string;
  coins: number;
  created_at: string;
}

interface Progress {
  student_id: string;
  module_id: string;
  completed: boolean;
  coins_earned: number;
}

export function AdminPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ telegram: '', name: '', coins: 0 });
  const [newStudent, setNewStudent] = useState({ telegram: '', name: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [studentsRes, progressRes] = await Promise.all([
        supabase.from('students').select('*').order('created_at', { ascending: false }),
        supabase.from('progress').select('*')
      ]);

      if (studentsRes.error) throw studentsRes.error;
      if (progressRes.error) throw progressRes.error;

      setStudents(studentsRes.data || []);
      setProgress(progressRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить данные',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStudent = async () => {
    if (!newStudent.telegram || !newStudent.name) {
      toast({ title: 'Заполните все поля', variant: 'destructive' });
      return;
    }

    const telegram = newStudent.telegram.startsWith('@') 
      ? newStudent.telegram.slice(1) 
      : newStudent.telegram;

    try {
      const { error } = await supabase.from('students').insert({
        telegram,
        name: newStudent.name,
        coins: 0
      });

      if (error) throw error;

      toast({ title: 'Студент добавлен' });
      setNewStudent({ telegram: '', name: '' });
      setShowAddForm(false);
      fetchData();
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (student: Student) => {
    setEditingId(student.id);
    setEditForm({
      telegram: student.telegram,
      name: student.name,
      coins: student.coins
    });
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    try {
      const { error } = await supabase
        .from('students')
        .update({
          telegram: editForm.telegram,
          name: editForm.name,
          coins: editForm.coins
        })
        .eq('id', editingId);

      if (error) throw error;

      toast({ title: 'Сохранено' });
      setEditingId(null);
      fetchData();
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const getStudentProgress = (studentId: string) => {
    const studentProgress = progress.filter(p => p.student_id === studentId);
    const completed = studentProgress.filter(p => p.completed).length;
    const total = 15; // Total modules
    return { completed, total, percent: Math.round((completed / total) * 100) };
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.telegram.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCoins = students.reduce((sum, s) => sum + s.coins, 0);
  const avgProgress = students.length > 0
    ? Math.round(students.reduce((sum, s) => sum + getStudentProgress(s.id).percent, 0) / students.length)
    : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-semibold text-primary mb-4">
          <Users className="h-3 w-3" />
          АДМИН ПАНЕЛЬ
        </div>
        <h1 className="heading-display text-foreground">
          Управление <span className="text-primary italic">студентами</span>
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card-elevated p-4 text-center">
          <Users className="h-6 w-6 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{students.length}</p>
          <p className="text-xs text-muted-foreground">Студентов</p>
        </div>
        <div className="card-elevated p-4 text-center">
          <Coins className="h-6 w-6 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{totalCoins}</p>
          <p className="text-xs text-muted-foreground">Всего коинов</p>
        </div>
        <div className="card-elevated p-4 text-center">
          <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{avgProgress}%</p>
          <p className="text-xs text-muted-foreground">Средний прогресс</p>
        </div>
      </div>

      {/* Search & Add */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по имени или telegram..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Добавить
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="card-elevated p-4 animate-fade-in">
          <h3 className="font-semibold mb-4">Новый студент</h3>
          <div className="flex gap-4">
            <Input
              placeholder="@telegram"
              value={newStudent.telegram}
              onChange={(e) => setNewStudent(p => ({ ...p, telegram: e.target.value }))}
            />
            <Input
              placeholder="Имя"
              value={newStudent.name}
              onChange={(e) => setNewStudent(p => ({ ...p, name: e.target.value }))}
            />
            <Button onClick={handleAddStudent}>Добавить</Button>
          </div>
        </div>
      )}

      {/* Students List */}
      <div className="space-y-3">
        {filteredStudents.map((student) => {
          const prog = getStudentProgress(student.id);
          const isEditing = editingId === student.id;

          return (
            <div key={student.id} className="card-elevated p-4">
              {isEditing ? (
                <div className="flex items-center gap-4">
                  <Input
                    value={editForm.telegram}
                    onChange={(e) => setEditForm(f => ({ ...f, telegram: e.target.value }))}
                    className="w-32"
                  />
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={editForm.coins}
                    onChange={(e) => setEditForm(f => ({ ...f, coins: parseInt(e.target.value) || 0 }))}
                    className="w-24"
                  />
                  <Button size="icon" variant="ghost" onClick={handleSaveEdit}>
                    <Check className="h-4 w-4 text-success" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setEditingId(null)}>
                    <X className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold text-primary">
                        {student.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{student.name}</p>
                      <p className="text-sm text-muted-foreground">@{student.telegram}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-lg font-bold text-primary">{student.coins}</p>
                      <p className="text-xs text-muted-foreground">коинов</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-foreground">{prog.completed}/{prog.total}</p>
                      <p className="text-xs text-muted-foreground">модулей</p>
                    </div>
                    <div className="w-24">
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${prog.percent}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground text-center mt-1">{prog.percent}%</p>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(student)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
