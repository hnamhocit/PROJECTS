import { Project } from './project'
import { Team } from './team'

export type ProjectWithTeam = Project & { team: Team }
