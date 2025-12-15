'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import TodoDashboard from './TodoDashboard'

interface Project {
  id: string
  nome: string
  descrizione: string | null
  colore: string
  stato: string
  priorita: number
  data_scadenza: string | null
}

interface Task {
  id: string
  project_id: string
  titolo: string
  descrizione: string | null
  stato: string
  priorita: number
  tags: string[] | null
  data_scadenza: string | null
  data_completamento: string | null
}

export default function TodoDashboardWrapper() {
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('todo_projects')
        .select('*')
        .order('priorita', { ascending: false })
        .order('created_at', { ascending: false })

      if (projectsError) {
        console.error('Error loading projects:', projectsError)
      } else {
        console.log('Projects loaded:', projectsData?.length || 0)
        setProjects(projectsData || [])
      }

      // Fetch tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('todo_tasks')
        .select('*')
        .order('priorita', { ascending: false })
        .order('ordine', { ascending: true })
        .order('created_at', { ascending: false })

      if (tasksError) {
        console.error('Error loading tasks:', tasksError)
      } else {
        console.log('Tasks loaded:', tasksData?.length || 0)
        setTasks(tasksData || [])
      }
    } catch (err) {
      console.error('Exception loading data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-lg">Caricamento...</div>
      </div>
    )
  }

  return <TodoDashboard initialProjects={projects} initialTasks={tasks} />
}
