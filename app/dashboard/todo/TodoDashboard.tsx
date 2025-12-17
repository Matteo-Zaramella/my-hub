'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

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

interface TodoDashboardProps {
  initialProjects: Project[]
  initialTasks: Task[]
}

const STATI_TASK = [
  { value: 'da_fare', label: 'Da Fare', color: 'bg-gray-500' },
  { value: 'in_corso', label: 'In Corso', color: 'bg-blue-500' },
  { value: 'completato', label: 'Completato', color: 'bg-green-500' },
  { value: 'bloccato', label: 'Bloccato', color: 'bg-red-500' },
]

const PRIORITA = [
  { value: 0, label: 'Bassa', color: 'text-gray-400' },
  { value: 1, label: 'Media', color: 'text-yellow-400' },
  { value: 2, label: 'Alta', color: 'text-orange-400' },
  { value: 3, label: 'Urgente', color: 'text-red-400' },
]

export default function TodoDashboard({ initialProjects, initialTasks }: TodoDashboardProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [showNewTaskForm, setShowNewTaskForm] = useState(false)
  const [showNewProjectForm, setShowNewProjectForm] = useState(false)
  const [draggedTask, setDraggedTask] = useState<string | null>(null)
  const [newTask, setNewTask] = useState({
    titolo: '',
    descrizione: '',
    priorita: 1,
    tags: '',
  })
  const [newProject, setNewProject] = useState({
    nome: '',
    descrizione: '',
    colore: '#6366f1',
    priorita: 1,
  })

  const supabase = createClient()

  const filteredTasks = selectedProject
    ? tasks.filter(t => t.project_id === selectedProject)
    : tasks

  const getProjectById = (id: string) => projects.find(p => p.id === id)

  async function handleCreateTask() {
    if (!newTask.titolo.trim() || !selectedProject) return

    const { data, error } = await supabase
      .from('todo_tasks')
      .insert({
        project_id: selectedProject,
        titolo: newTask.titolo,
        descrizione: newTask.descrizione || null,
        priorita: newTask.priorita,
        tags: newTask.tags ? newTask.tags.split(',').map(t => t.trim()) : [],
        stato: 'da_fare',
      })
      .select()
      .single()

    if (!error && data) {
      setTasks([data, ...tasks])
      setNewTask({ titolo: '', descrizione: '', priorita: 1, tags: '' })
      setShowNewTaskForm(false)
    }
  }

  async function handleCreateProject() {
    if (!newProject.nome.trim()) return

    const { data, error } = await supabase
      .from('todo_projects')
      .insert({
        nome: newProject.nome,
        descrizione: newProject.descrizione || null,
        colore: newProject.colore,
        priorita: newProject.priorita,
        stato: 'attivo',
      })
      .select()
      .single()

    if (!error && data) {
      setProjects([data, ...projects])
      setNewProject({ nome: '', descrizione: '', colore: '#6366f1', priorita: 1 })
      setShowNewProjectForm(false)
      setSelectedProject(data.id)
    }
  }

  async function handleUpdateTaskStatus(taskId: string, newStatus: string) {
    const updates: any = { stato: newStatus }
    if (newStatus === 'completato') {
      updates.data_completamento = new Date().toISOString()
    }

    const { error } = await supabase
      .from('todo_tasks')
      .update(updates)
      .eq('id', taskId)

    if (!error) {
      setTasks(tasks.map(t => t.id === taskId ? { ...t, ...updates } : t))
    }
  }

  async function handleDeleteTask(taskId: string) {
    const { error } = await supabase
      .from('todo_tasks')
      .delete()
      .eq('id', taskId)

    if (!error) {
      setTasks(tasks.filter(t => t.id !== taskId))
    }
  }

  function handleDragStart(taskId: string) {
    setDraggedTask(taskId)
  }

  function handleDragEnd() {
    setDraggedTask(null)
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
  }

  async function handleDrop(newStatus: string) {
    if (!draggedTask) return

    await handleUpdateTaskStatus(draggedTask, newStatus)
    setDraggedTask(null)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar - Projects */}
      <div className="lg:col-span-1 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Progetti</h2>
          <button
            onClick={() => setShowNewProjectForm(!showNewProjectForm)}
            className="text-white/60 hover:text-white text-2xl"
          >
            +
          </button>
        </div>

        {showNewProjectForm && (
          <div className="bg-white/5 p-4 rounded-lg space-y-3">
            <input
              type="text"
              placeholder="Nome progetto"
              value={newProject.nome}
              onChange={(e) => setNewProject({ ...newProject, nome: e.target.value })}
              className="w-full bg-white/10 text-white px-3 py-2 rounded border border-white/20"
            />
            <textarea
              placeholder="Descrizione"
              value={newProject.descrizione}
              onChange={(e) => setNewProject({ ...newProject, descrizione: e.target.value })}
              className="w-full bg-white/10 text-white px-3 py-2 rounded border border-white/20 h-20"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreateProject}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded"
              >
                Crea
              </button>
              <button
                onClick={() => setShowNewProjectForm(false)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded"
              >
                Annulla
              </button>
            </div>
          </div>
        )}

        <div
          onClick={() => setSelectedProject(null)}
          className={`p-3 rounded-lg cursor-pointer transition ${
            selectedProject === null
              ? 'bg-white/20 border border-white/30'
              : 'bg-white/5 hover:bg-white/10 border border-white/10'
          }`}
        >
          <div className="font-medium text-white">Tutti i task</div>
          <div className="text-sm text-white/60">{tasks.length} task</div>
        </div>

        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => setSelectedProject(project.id)}
            className={`p-3 rounded-lg cursor-pointer transition ${
              selectedProject === project.id
                ? 'bg-white/20 border border-white/30'
                : 'bg-white/5 hover:bg-white/10 border border-white/10'
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: project.colore }}
              />
              <div className="font-medium text-white">{project.nome}</div>
            </div>
            <div className="text-sm text-white/60 mt-1">
              {tasks.filter(t => t.project_id === project.id).length} task
            </div>
          </div>
        ))}
      </div>

      {/* Main - Tasks */}
      <div className="lg:col-span-3 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            {selectedProject ? getProjectById(selectedProject)?.nome : 'Tutti i Task'}
          </h2>
          {selectedProject && (
            <button
              onClick={() => setShowNewTaskForm(!showNewTaskForm)}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded"
            >
              + Nuovo Task
            </button>
          )}
        </div>

        {showNewTaskForm && selectedProject && (
          <div className="bg-white/5 p-4 rounded-lg space-y-3">
            <input
              type="text"
              placeholder="Titolo task"
              value={newTask.titolo}
              onChange={(e) => setNewTask({ ...newTask, titolo: e.target.value })}
              className="w-full bg-white/10 text-white px-3 py-2 rounded border border-white/20"
            />
            <textarea
              placeholder="Descrizione"
              value={newTask.descrizione}
              onChange={(e) => setNewTask({ ...newTask, descrizione: e.target.value })}
              className="w-full bg-white/10 text-white px-3 py-2 rounded border border-white/20 h-24"
            />
            <div className="flex gap-4">
              <select
                value={newTask.priorita}
                onChange={(e) => setNewTask({ ...newTask, priorita: parseInt(e.target.value) })}
                className="bg-white/10 text-white px-3 py-2 rounded border border-white/20"
              >
                {PRIORITA.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Tags (separati da virgola)"
                value={newTask.tags}
                onChange={(e) => setNewTask({ ...newTask, tags: e.target.value })}
                className="flex-1 bg-white/10 text-white px-3 py-2 rounded border border-white/20"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCreateTask}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded"
              >
                Crea Task
              </button>
              <button
                onClick={() => setShowNewTaskForm(false)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded"
              >
                Annulla
              </button>
            </div>
          </div>
        )}

        {/* Tasks by Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {STATI_TASK.map((stato) => {
            const tasksInStatus = filteredTasks.filter(t => t.stato === stato.value)
            return (
              <div
                key={stato.value}
                className={`bg-white/5 p-4 rounded-lg transition-colors ${
                  draggedTask ? 'border-2 border-dashed border-white/20' : ''
                }`}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(stato.value)}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-3 h-3 rounded-full ${stato.color}`} />
                  <h3 className="font-medium text-white">{stato.label}</h3>
                  <span className="text-white/60 text-sm ml-auto">{tasksInStatus.length}</span>
                </div>

                <div className="space-y-2">
                  {tasksInStatus.map((task) => {
                    const project = getProjectById(task.project_id)
                    const priorita = PRIORITA.find(p => p.value === task.priorita)
                    return (
                      <div
                        key={task.id}
                        className={`bg-white/10 p-3 rounded space-y-2 cursor-move transition-opacity ${
                          draggedTask === task.id ? 'opacity-50' : 'opacity-100'
                        }`}
                        draggable
                        onDragStart={() => handleDragStart(task.id)}
                        onDragEnd={handleDragEnd}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-white text-sm">{task.titolo}</div>
                            {task.descrizione && (
                              <div className="text-white/60 text-xs mt-1 line-clamp-2">{task.descrizione}</div>
                            )}
                          </div>
                          <span className={`text-xs ${priorita?.color} ml-2`}>●</span>
                        </div>

                        {project && (
                          <div className="flex items-center gap-1 text-xs text-white/60">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: project.colore }}
                            />
                            {project.nome}
                          </div>
                        )}

                        {task.tags && task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {task.tags.map((tag, i) => (
                              <span key={i} className="text-xs bg-white/10 px-2 py-0.5 rounded text-white/60">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-1">
                          {STATI_TASK.filter(s => s.value !== task.stato).map((s) => (
                            <button
                              key={s.value}
                              onClick={() => handleUpdateTaskStatus(task.id, s.value)}
                              className="text-xs bg-white/5 hover:bg-white/20 px-2 py-1 rounded text-white/60"
                              title={`Sposta in ${s.label}`}
                            >
                              {s.label.charAt(0)}
                            </button>
                          ))}
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="ml-auto text-xs bg-red-500/20 hover:bg-red-500/40 px-2 py-1 rounded text-red-400"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
