import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://gdsctvazrvfzcwgspdrq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdkc2N0dmF6cnZmemN3Z3NwZHJxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMjEwNjg2NywiZXhwIjoyMDE3NjgyODY3fQ.BKft1zijXatxUOdwH43xBBB0JncvRrm34EdXSCU7KjI', {
	auth: {
		autoRefreshToken: false,
		persistSession: false
	}
})

export const adminAuthClient = supabase.auth.admin
