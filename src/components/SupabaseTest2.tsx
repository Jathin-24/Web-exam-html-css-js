import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const SupabaseTest2 = () => {
  const [status, setStatus] = useState<string>('Checking configuration...');
  const [details, setDetails] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkConfig = () => {
      const url = import.meta.env.VITE_CUSTOM_SUPABASE_URL;
      const key = import.meta.env.VITE_CUSTOM_SUPABASE_ANON_KEY;
      
      let msg = '';
      if (!url) msg += 'Missing VITE_CUSTOM_SUPABASE_URL\n';
      if (!key) msg += 'Missing VITE_CUSTOM_SUPABASE_ANON_KEY\n';
      
      if (msg) {
        setStatus('✗ Environment variables missing');
        setDetails(msg);
        return;
      }
      
      if (isSupabaseConfigured && supabase) {
        setStatus('✓ Supabase configured');
        setDetails(`URL: ${url.substring(0, 40)}...\nKey: ${key.substring(0, 30)}...`);
      } else {
        setStatus('✗ Supabase NOT initialized');
        setDetails('Check environment variables');
      }
    };
    checkConfig();
  }, []);

  const testConnection = async () => {
    setLoading(true);
    try {
      if (!supabase) throw new Error('Supabase client not initialized');

      const { data, error, status: httpStatus } = await supabase
        .from('students')
        .select('*')
        .limit(1);

      if (error) {
        console.error('Query error:', error);
        throw error;
      }

      setStatus(`✓ Connection successful! HTTP ${httpStatus}`);
      setDetails(`Found ${data?.length || 0} existing student records`);
    } catch (error: any) {
      console.error('Connection test error:', error);
      setStatus(`✗ Connection failed`);
      setDetails(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testInsert = async () => {
    setLoading(true);
    try {
      if (!supabase) throw new Error('Supabase client not initialized');

      const testStudent = {
        id: `test-${Date.now()}`,
        roll_no: `TEST${Date.now()}`,
        name: 'Test Student',
        created_at: new Date().toISOString(),
      };

      const { data, error, status: httpStatus } = await supabase
        .from('students')
        .insert([testStudent])
        .select();

      if (error) {
        console.error('Insert error:', error);
        throw error;
      }

      setStatus(`✓ Insert successful! HTTP ${httpStatus}`);
      setDetails(`Created test student: ${testStudent.roll_no}`);
    } catch (error: any) {
      console.error('Insert error:', error);
      setStatus(`✗ Insert failed`);
      setDetails(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <Card className="max-w-2xl mx-auto mt-10">
        <CardHeader>
          <CardTitle>Supabase Diagnostic Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="p-4 bg-slate-900 text-white rounded font-mono text-sm">
              {status}
            </div>
            {details && (
              <div className="p-4 bg-slate-100 rounded text-sm font-mono whitespace-pre-wrap">
                {details}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3">
            <Button onClick={testConnection} disabled={loading} className="w-full">
              {loading ? 'Testing...' : 'Test Connection'}
            </Button>
            <Button onClick={testInsert} disabled={loading} variant="outline" className="w-full">
              {loading ? 'Testing...' : 'Test Insert'}
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>Check browser console (F12) for detailed error messages if tests fail.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
