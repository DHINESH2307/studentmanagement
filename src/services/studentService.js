import { supabase, isSupabaseConfigured } from './supabase';

export const studentService = {
  async getStudents({ 
    search = '', 
    department = 'All', 
    year = 'All', 
    page = 1, 
    pageSize = 10, 
    sortBy = 'created_at', 
    sortOrder = 'desc' 
  }) {
    if (!isSupabaseConfigured) {
      return { data: [], count: 0, error: null };
    }

    let query = supabase
      .from('students')
      .select('*', { count: 'exact' });

    // Search filter (name, email, department)
    if (search && search.trim() !== '') {
      const s = search.trim();
      query = query.or(`name.ilike.%${s}%,email.ilike.%${s}%,department.ilike.%${s}%`);
    }

    // Department filter
    if (department && department !== 'All') {
      query = query.eq('department', department);
    }

    // Year filter
    if (year && year !== 'All') {
      query = query.eq('year', parseInt(year, 10));
    }

    // Sorting
    const ascending = sortOrder === 'asc';
    query = query.order(sortBy, { ascending });

    // Pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    return { data: data || [], count: count || 0, error: null };
  },

  async getStudentById(id) {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async createStudent(studentData) {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');
    
    // Check for duplicate email for this user
    const { data: existing } = await supabase
      .from('students')
      .select('id')
      .eq('email', studentData.email)
      .maybeSingle();

    if (existing) {
      throw new Error(`A student with email "${studentData.email}" already exists.`);
    }

    const { data, error } = await supabase
      .from('students')
      .insert([studentData])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error('A student with this email already exists.');
      }
      throw error;
    }
    return data;
  },

  async updateStudent(id, studentData) {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');
    
    // Check if updating email conflicts with another record
    if (studentData.email) {
      const { data: existing } = await supabase
        .from('students')
        .select('id')
        .eq('email', studentData.email)
        .neq('id', id)
        .maybeSingle();

      if (existing) {
        throw new Error(`A student with email "${studentData.email}" already exists.`);
      }
    }

    const { data, error } = await supabase
      .from('students')
      .update(studentData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error('A student with this email already exists.');
      }
      throw error;
    }
    return data;
  },

  async deleteStudent(id) {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  async deleteStudentsBulk(ids) {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');
    if (!ids || ids.length === 0) return true;

    const { error } = await supabase
      .from('students')
      .delete()
      .in('id', ids);
    if (error) throw error;
    return true;
  },

  async getDepartmentStats() {
    if (!isSupabaseConfigured) {
      return {
        total: 0,
        recent: [],
        departmentCounts: {},
      };
    }

    // Fetch all students for stats calculation
    const { data, error } = await supabase
      .from('students')
      .select('id, name, email, department, created_at, avatar_url')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const students = data || [];
    const total = students.length;
    const recent = students.slice(0, 5);

    const departmentCounts = students.reduce((acc, student) => {
      const dept = student.department || 'Other';
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      recent,
      departmentCounts,
    };
  },

  async importStudentsCsv(studentsArray) {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');
    if (!studentsArray || studentsArray.length === 0) return { inserted: 0, errors: [] };

    const errors = [];
    let insertedCount = 0;

    // Get existing emails to avoid constraint violations during batch insert
    const { data: existingRecords } = await supabase
      .from('students')
      .select('email');
    
    const existingEmails = new Set((existingRecords || []).map(r => r.email.toLowerCase()));

    const validStudents = [];

    for (let i = 0; i < studentsArray.length; i++) {
      const row = studentsArray[i];
      const rowNum = i + 1;

      if (!row.name || !row.email || !row.department || !row.year || !row.phone) {
        errors.push(`Row ${rowNum}: Missing required fields (name, email, phone, department, or year).`);
        continue;
      }

      const email = row.email.trim().toLowerCase();
      if (existingEmails.has(email)) {
        errors.push(`Row ${rowNum}: Duplicate email "${row.email}" already exists.`);
        continue;
      }

      const yearInt = parseInt(row.year, 10);
      if (isNaN(yearInt) || yearInt < 1 || yearInt > 6) {
        errors.push(`Row ${rowNum}: Year must be a number between 1 and 6.`);
        continue;
      }

      existingEmails.add(email);
      validStudents.push({
        name: row.name.trim(),
        email: email,
        phone: row.phone.trim(),
        department: row.department.trim(),
        year: yearInt,
        avatar_url: row.avatar_url || null,
      });
    }

    if (validStudents.length > 0) {
      const { error } = await supabase
        .from('students')
        .insert(validStudents);

      if (error) {
        throw new Error(`Failed to import records: ${error.message}`);
      }
      insertedCount = validStudents.length;
    }

    return { inserted: insertedCount, errors };
  }
};
