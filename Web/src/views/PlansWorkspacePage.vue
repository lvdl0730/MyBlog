<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { message } from "ant-design-vue";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  FolderAddOutlined,
  NodeIndexOutlined,
  PlusOutlined,
  RocketOutlined,
} from "@ant-design/icons-vue";
import { useAuthStore } from "@/stores/auth.ts";

type ProjectStatus = "planning" | "active" | "done";
type SubPlanStatus = "todo" | "doing" | "done";
type DurationUnit = "分钟" | "小时" | "天" | "周" | "月" | "年";

interface PlanProject {
  id: number;
  title: string;
  overview: string;
  goal: string;
  workItems: string[];
  acceptanceCriteria: string[];
  tags: string[];
  scheduleDate: string;
  status: ProjectStatus;
}

interface ProjectSubPlan {
  id: number;
  projectId: number;
  title: string;
  description: string;
  dueDate: string;
  estimateValue: number;
  estimateUnit: DurationUnit;
  status: SubPlanStatus;
}

const authStore = useAuthStore();
const durationUnits: DurationUnit[] = ["分钟", "小时", "天", "周", "月", "年"];

const projects = ref<PlanProject[]>([
  {
    id: 1,
    title: "内容系统主链路",
    overview: "跑通首页、文章列表、文章详情、标签页之间的内容流转。",
    goal: "形成完整阅读链路。",
    workItems: ["首页推荐区整理", "文章列表结构优化", "详情页目录和标签联动"],
    acceptanceCriteria: ["首页可进入详情", "标签筛选正确"],
    tags: ["Home", "Articles", "Markdown"],
    scheduleDate: "2026-03-18",
    status: "active",
  },
  {
    id: 2,
    title: "编辑器与资源上传",
    overview: "让管理员具备可用写作体验。",
    goal: "完成编辑器方案和图片上传链路。",
    workItems: ["确定编辑器方案", "接入上传适配", "支持编辑旧文章"],
    acceptanceCriteria: ["管理员可新建编辑文章", "上传图片可展示"],
    tags: ["Editor", "Upload"],
    scheduleDate: "2026-03-25",
    status: "planning",
  },
  {
    id: 3,
    title: "计划模块与搜索浮层",
    overview: "补齐后台型交互。",
    goal: "完成项目、子计划和搜索浮层交互。",
    workItems: ["计划页两层结构", "管理员维护能力", "搜索弹层关闭语义"],
    acceptanceCriteria: ["可增删改子计划", "搜索结果可跳转"],
    tags: ["Plans", "Search"],
    scheduleDate: "2026-04-02",
    status: "done",
  },
]);

const subPlans = ref<ProjectSubPlan[]>([
  {
    id: 1,
    projectId: 1,
    title: "补齐标签页与标签文章列表页",
    description: "保证标签点击后有完整筛选结果。",
    dueDate: "2026-03-21",
    estimateValue: 2,
    estimateUnit: "天",
    status: "todo",
  },
  {
    id: 2,
    projectId: 2,
    title: "确定 Markdown 编辑器方案",
    description: "比较 md-editor-v3 与 ByteMD。",
    dueDate: "2026-03-24",
    estimateValue: 4,
    estimateUnit: "小时",
    status: "doing",
  },
  {
    id: 3,
    projectId: 3,
    title: "重构搜索弹窗关闭语义",
    description: "关闭按钮只负责关闭窗口。",
    dueDate: "2026-03-18",
    estimateValue: 30,
    estimateUnit: "分钟",
    status: "done",
  },
]);

const projectModalOpen = ref(false);
const subPlanModalOpen = ref(false);
const editingProjectId = ref<number | null>(null);
const editingSubPlanId = ref<number | null>(null);

const projectForm = reactive({
  title: "",
  overview: "",
  goal: "",
  workText: "",
  acceptanceText: "",
  tagText: "",
  scheduleDate: "",
  status: "planning" as ProjectStatus,
});

const subPlanForm = reactive({
  projectId: 0,
  title: "",
  description: "",
  dueDate: "",
  estimateValue: 0,
  estimateUnit: "天" as DurationUnit,
  status: "todo" as SubPlanStatus,
});

const parseLineList = (value: string) => value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
const parseTags = (value: string) => value.split(/[,\n，]/).map((item) => item.trim()).filter(Boolean);
const formatDate = (value: string) => {
  const [year, month, day] = value.split("-");
  return year && month && day ? `${year}年${month}月${day}日` : value || "未设置";
};
const formatEstimate = (item: ProjectSubPlan) => `${item.estimateValue}${item.estimateUnit}`;

const totalProjects = computed(() => projects.value.length);
const totalSubPlans = computed(() => subPlans.value.length);
const openSubPlans = computed(() => subPlans.value.filter((item) => item.status !== "done").length);
const currentProject = computed(() => projects.value.find((item) => item.status === "active") ?? projects.value[0] ?? null);
const projectModalTitle = computed(() => (editingProjectId.value ? "编辑项目" : "添加项目"));
const subPlanModalTitle = computed(() => (editingSubPlanId.value ? "编辑子计划" : "添加子计划"));

const subPlanMap = computed(() =>
  projects.value.reduce<Record<number, ProjectSubPlan[]>>((acc, project) => {
    acc[project.id] = subPlans.value.filter((item) => item.projectId === project.id);
    return acc;
  }, {}),
);

const getProjectProgress = (projectId: number) => {
  const items = subPlanMap.value[projectId] ?? [];
  const done = items.filter((item) => item.status === "done").length;
  return { done, total: items.length, percent: items.length ? Math.round((done / items.length) * 100) : 0 };
};

const projectStatusText = (status: ProjectStatus) =>
  status === "done" ? "已完成" : status === "active" ? "进行中" : "规划中";
const subPlanStatusText = (status: SubPlanStatus) =>
  status === "done" ? "已完成" : status === "doing" ? "进行中" : "待办";
const nextActionText = (status: SubPlanStatus) =>
  status === "todo" ? "开始执行" : status === "doing" ? "标记完成" : "恢复待办";

const ensureAdminPermission = () => {
  if (authStore.isAdmin) return true;
  message.error("您的权限不够");
  return false;
};

const resetProjectForm = () => {
  editingProjectId.value = null;
  Object.assign(projectForm, {
    title: "",
    overview: "",
    goal: "",
    workText: "",
    acceptanceText: "",
    tagText: "",
    scheduleDate: "",
    status: "planning",
  });
};

const resetSubPlanForm = () => {
  editingSubPlanId.value = null;
  Object.assign(subPlanForm, {
    projectId: currentProject.value?.id ?? projects.value[0]?.id ?? 0,
    title: "",
    description: "",
    dueDate: "",
    estimateValue: 0,
    estimateUnit: "天",
    status: "todo",
  });
};

resetSubPlanForm();

const openAdminMode = () => {
  ensureAdminPermission();
};

const closeProjectModal = () => {
  projectModalOpen.value = false;
  resetProjectForm();
};

const closeSubPlanModal = () => {
  subPlanModalOpen.value = false;
  resetSubPlanForm();
};

const openProjectModal = () => {
  if (!ensureAdminPermission()) return;
  resetProjectForm();
  projectModalOpen.value = true;
};

const openEditProjectModal = (project: PlanProject) => {
  if (!ensureAdminPermission()) return;
  editingProjectId.value = project.id;
  Object.assign(projectForm, {
    title: project.title,
    overview: project.overview,
    goal: project.goal,
    workText: project.workItems.join("\n"),
    acceptanceText: project.acceptanceCriteria.join("\n"),
    tagText: project.tags.join(", "),
    scheduleDate: project.scheduleDate,
    status: project.status,
  });
  projectModalOpen.value = true;
};

const openSubPlanModal = (projectId?: number) => {
  if (!ensureAdminPermission()) return;
  resetSubPlanForm();
  if (projectId) subPlanForm.projectId = projectId;
  subPlanModalOpen.value = true;
};

const openEditSubPlanModal = (item: ProjectSubPlan) => {
  if (!ensureAdminPermission()) return;
  editingSubPlanId.value = item.id;
  Object.assign(subPlanForm, {
    projectId: item.projectId,
    title: item.title,
    description: item.description,
    dueDate: item.dueDate,
    estimateValue: item.estimateValue,
    estimateUnit: item.estimateUnit,
    status: item.status,
  });
  subPlanModalOpen.value = true;
};

const submitProject = () => {
  if (!ensureAdminPermission()) return;
  const workItems = parseLineList(projectForm.workText);
  const acceptanceCriteria = parseLineList(projectForm.acceptanceText);
  if (!projectForm.title.trim()) return message.error("请填写项目标题");
  if (!projectForm.goal.trim()) return message.error("请填写项目目标");
  if (!projectForm.scheduleDate) return message.error("请选择项目时间");
  if (!workItems.length) return message.error("请至少填写一项需要完成的工作");
  if (!acceptanceCriteria.length) return message.error("请至少填写一项验收标准");

  const payload: PlanProject = {
    id: editingProjectId.value ?? Date.now(),
    title: projectForm.title.trim(),
    overview: projectForm.overview.trim() || projectForm.goal.trim(),
    goal: projectForm.goal.trim(),
    workItems,
    acceptanceCriteria,
    tags: parseTags(projectForm.tagText),
    scheduleDate: projectForm.scheduleDate,
    status: projectForm.status,
  };

  projects.value = editingProjectId.value
    ? projects.value.map((item) => (item.id === editingProjectId.value ? payload : item))
    : [payload, ...projects.value];

  message.success(editingProjectId.value ? "项目已更新" : "项目已添加");
  closeProjectModal();
};

const submitSubPlan = () => {
  if (!ensureAdminPermission()) return;
  if (!subPlanForm.projectId) return message.error("请先选择所属项目");
  if (!subPlanForm.title.trim()) return message.error("请填写子计划标题");
  if (!subPlanForm.description.trim()) return message.error("请填写计划说明");
  if (!subPlanForm.dueDate) return message.error("请选择截止时间");
  if (subPlanForm.estimateValue < 0) return message.error("预计耗时不能为负数");

  const payload: ProjectSubPlan = {
    id: editingSubPlanId.value ?? Date.now(),
    projectId: subPlanForm.projectId,
    title: subPlanForm.title.trim(),
    description: subPlanForm.description.trim(),
    dueDate: subPlanForm.dueDate,
    estimateValue: subPlanForm.estimateValue,
    estimateUnit: subPlanForm.estimateUnit,
    status: subPlanForm.status,
  };

  subPlans.value = editingSubPlanId.value
    ? subPlans.value.map((item) => (item.id === editingSubPlanId.value ? payload : item))
    : [payload, ...subPlans.value];

  message.success(editingSubPlanId.value ? "子计划已更新" : "子计划已添加");
  closeSubPlanModal();
};

const advanceSubPlanStatus = (item: ProjectSubPlan) => {
  if (!ensureAdminPermission()) return;
  item.status = item.status === "todo" ? "doing" : item.status === "doing" ? "done" : "todo";
  message.success("子计划状态已更新");
};

const removeSubPlan = (id: number) => {
  if (!ensureAdminPermission()) return;
  subPlans.value = subPlans.value.filter((item) => item.id !== id);
  message.success("子计划已删除");
};

const removeProject = (projectId: number) => {
  if (!ensureAdminPermission()) return;
  projects.value = projects.value.filter((item) => item.id !== projectId);
  subPlans.value = subPlans.value.filter((item) => item.projectId !== projectId);
  if (subPlanForm.projectId === projectId) resetSubPlanForm();
  message.success("项目及其子计划已删除");
};
</script>

<template>
  <div class="plans-page">
    <section class="hero card">
      <div>
        <div class="eyebrow">Project Planning</div>
        <h2>项目与子计划的双层计划面板</h2>
        <p>项目负责目标、工作范围、验收标准和标签；子计划负责具体执行项，带截止时间与预计耗时。</p>
      </div>
      <div class="stats">
        <article class="stat"><span>项目总数</span><strong>{{ totalProjects }}</strong></article>
        <article class="stat"><span>子计划总数</span><strong>{{ totalSubPlans }}</strong></article>
        <article class="stat"><span>未完成子计划</span><strong>{{ openSubPlans }}</strong></article>
      </div>
    </section>

    <section class="admin-grid">
      <div class="card">
        <div class="eyebrow">管理员模式</div>
        <h3>{{ authStore.isAdmin ? "当前可以维护项目和子计划" : "仅管理员可以维护计划结构" }}</h3>
        <p>{{ authStore.isAdmin ? "管理员模式下可以添加、编辑、删除项目，也可以添加、编辑、推进和删除子计划。" : "当前只展示计划内容。非管理员点击入口时会直接提示权限不足。" }}</p>
        <div class="actions">
          <a-button v-if="!authStore.isAdmin" type="primary" @click="openAdminMode">进入管理员模式</a-button>
          <template v-else>
            <a-button type="primary" @click="openProjectModal"><template #icon><FolderAddOutlined /></template>添加项目</a-button>
            <a-button @click="openSubPlanModal()"><template #icon><NodeIndexOutlined /></template>添加子计划</a-button>
            <a-button @click="authStore.logout()">退出管理员模式</a-button>
          </template>
        </div>
      </div>
      <div class="card summary">
        <div><span>当前身份</span><strong>{{ authStore.isAdmin ? "管理员" : authStore.isLogin ? "普通用户" : "游客" }}</strong></div>
        <div><span>当前主项目</span><strong>{{ currentProject?.title ?? "暂无项目" }}</strong></div>
        <div><span>当前主项目进度</span><strong>{{ currentProject ? `${getProjectProgress(currentProject.id).done}/${getProjectProgress(currentProject.id).total}` : "0/0" }}</strong></div>
      </div>
    </section>

    <div class="roadmap">
      <div class="roadmap__line"></div>
      <section v-for="project in projects" :key="project.id" class="roadmap__section">
        <div class="roadmap__marker">
          <span class="dot" :class="`dot--${project.status}`"></span>
        </div>
        <div class="roadmap__body">
          <article class="card project-card">
            <div class="row head">
              <div>
                <p class="muted">{{ formatDate(project.scheduleDate) }}</p>
                <h3>{{ project.title }}</h3>
              </div>
              <div class="row">
                <span class="status" :class="`is-${project.status}`">
                  <CheckCircleOutlined v-if="project.status === 'done'" />
                  <RocketOutlined v-else-if="project.status === 'active'" />
                  <ClockCircleOutlined v-else />
                  {{ projectStatusText(project.status) }}
                </span>
                <a-button v-if="authStore.isAdmin" size="small" @click="openEditProjectModal(project)"><template #icon><EditOutlined /></template></a-button>
                <a-button v-if="authStore.isAdmin" danger size="small" @click="removeProject(project.id)"><template #icon><DeleteOutlined /></template></a-button>
              </div>
            </div>

            <p>{{ project.overview }}</p>
            <p><strong>项目目标：</strong>{{ project.goal }}</p>

            <div class="grid">
              <div class="panel">
                <h4>需要完成的工作</h4>
                <ul><li v-for="item in project.workItems" :key="item">{{ item }}</li></ul>
              </div>
              <div class="panel">
                <h4>验收标准</h4>
                <ul><li v-for="item in project.acceptanceCriteria" :key="item">{{ item }}</li></ul>
              </div>
            </div>

            <div class="row foot">
              <div class="tags"><a-tag v-for="tag in project.tags" :key="tag">{{ tag }}</a-tag></div>
              <div class="muted">子计划进度：{{ getProjectProgress(project.id).done }}/{{ getProjectProgress(project.id).total }}<span v-if="getProjectProgress(project.id).total">（{{ getProjectProgress(project.id).percent }}%）</span></div>
            </div>

            <div class="subplans">
              <div class="row head">
                <h4>项目下的子计划</h4>
                <a-button v-if="authStore.isAdmin" size="small" @click="openSubPlanModal(project.id)"><template #icon><PlusOutlined /></template>添加子计划</a-button>
              </div>
              <a-empty v-if="!(subPlanMap[project.id] ?? []).length" description="当前项目还没有子计划" />
              <div v-else class="subplan-list">
                <div v-for="item in subPlanMap[project.id]" :key="item.id" class="subplan" :class="`is-${item.status}`">
                  <div>
                    <div class="row"><h5>{{ item.title }}</h5><a-tag :color="item.status === 'done' ? 'green' : item.status === 'doing' ? 'blue' : 'gold'">{{ subPlanStatusText(item.status) }}</a-tag></div>
                    <p>{{ item.description }}</p>
                    <div class="muted">截止时间：{{ formatDate(item.dueDate) }}　预计耗时：{{ formatEstimate(item) }}</div>
                  </div>
                  <div v-if="authStore.isAdmin" class="row">
                    <a-button size="small" @click="openEditSubPlanModal(item)"><template #icon><EditOutlined /></template></a-button>
                    <a-button size="small" @click="advanceSubPlanStatus(item)">{{ nextActionText(item.status) }}</a-button>
                    <a-button danger size="small" @click="removeSubPlan(item.id)"><template #icon><DeleteOutlined /></template></a-button>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>

    <a-modal :open="projectModalOpen" :title="projectModalTitle" ok-text="保存项目" cancel-text="取消" @ok="submitProject" @cancel="closeProjectModal">
      <a-form layout="vertical">
        <a-form-item label="项目标题"><a-input v-model:value="projectForm.title" /></a-form-item>
        <a-form-item label="项目概述"><a-textarea v-model:value="projectForm.overview" :rows="3" /></a-form-item>
        <a-form-item label="项目目标"><a-textarea v-model:value="projectForm.goal" :rows="3" /></a-form-item>
        <a-form-item label="需要完成的工作"><a-textarea v-model:value="projectForm.workText" :rows="4" placeholder="每行一项" /></a-form-item>
        <a-form-item label="验收标准"><a-textarea v-model:value="projectForm.acceptanceText" :rows="4" placeholder="每行一项" /></a-form-item>
        <div class="grid">
          <a-form-item label="标签"><a-input v-model:value="projectForm.tagText" placeholder="多个标签用逗号分隔" /></a-form-item>
          <a-form-item label="项目时间"><a-date-picker v-model:value="projectForm.scheduleDate" value-format="YYYY-MM-DD" format="YYYY年MM月DD日" style="width: 100%" /></a-form-item>
        </div>
        <a-form-item label="项目状态"><a-select v-model:value="projectForm.status"><a-select-option value="planning">规划中</a-select-option><a-select-option value="active">进行中</a-select-option><a-select-option value="done">已完成</a-select-option></a-select></a-form-item>
      </a-form>
    </a-modal>

    <a-modal :open="subPlanModalOpen" :title="subPlanModalTitle" ok-text="保存子计划" cancel-text="取消" @ok="submitSubPlan" @cancel="closeSubPlanModal">
      <a-form layout="vertical">
        <a-form-item label="所属项目"><a-select v-model:value="subPlanForm.projectId"><a-select-option v-for="project in projects" :key="project.id" :value="project.id">{{ project.title }}</a-select-option></a-select></a-form-item>
        <a-form-item label="子计划标题"><a-input v-model:value="subPlanForm.title" /></a-form-item>
        <a-form-item label="计划说明"><a-textarea v-model:value="subPlanForm.description" :rows="4" /></a-form-item>
        <div class="grid">
          <a-form-item label="截止时间"><a-date-picker v-model:value="subPlanForm.dueDate" value-format="YYYY-MM-DD" format="YYYY年MM月DD日" style="width: 100%" /></a-form-item>
          <a-form-item label="状态"><a-select v-model:value="subPlanForm.status"><a-select-option value="todo">待办</a-select-option><a-select-option value="doing">进行中</a-select-option><a-select-option value="done">已完成</a-select-option></a-select></a-form-item>
        </div>
        <div class="grid">
          <a-form-item label="预计耗时数值"><a-input-number v-model:value="subPlanForm.estimateValue" :min="0" style="width: 100%" /></a-form-item>
          <a-form-item label="预计耗时单位"><a-select v-model:value="subPlanForm.estimateUnit"><a-select-option v-for="unit in durationUnits" :key="unit" :value="unit">{{ unit }}</a-select-option></a-select></a-form-item>
        </div>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped>
.plans-page,
.roadmap {
  width: 100%;
}

.card {
  padding: 24px 28px;
  border: 1px solid #edf1f7;
  border-radius: 24px;
  background: linear-gradient(145deg, #ffffff, #fbfdff);
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.05);
}

.hero,
.admin-grid {
  display: grid;
  gap: 18px;
  margin-bottom: 24px;
}

.hero {
  grid-template-columns: minmax(0, 1.4fr) minmax(320px, 0.9fr);
}

.admin-grid {
  grid-template-columns: minmax(0, 1.45fr) minmax(280px, 0.8fr);
}

.hero h2,
.card h3 {
  margin: 0;
  color: #1f1f1f;
}

.hero p,
.card p {
  margin: 0;
  line-height: 1.85;
  color: #595959;
}

.eyebrow {
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #1677ff;
}

.muted {
  font-size: 13px;
  color: #8c8c8c;
}

.stats {
  display: grid;
  gap: 12px;
}

.stat {
  padding: 18px 20px;
  border: 1px solid rgba(22, 119, 255, 0.08);
  border-radius: 18px;
  background: #f9fbff;
}

.stat span {
  display: block;
  font-size: 13px;
  color: #8c8c8c;
}

.stat strong {
  display: block;
  margin-top: 8px;
  font-size: 28px;
  line-height: 1.1;
  color: #1f1f1f;
}

.actions,
.row,
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.summary {
  display: grid;
  gap: 14px;
}

.summary > div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px dashed #f0f0f0;
}

.summary > div:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.roadmap {
  position: relative;
  padding-left: 8px;
}

.roadmap__line {
  position: absolute;
  top: 10px;
  bottom: 0;
  left: 23px;
  width: 2px;
  background: linear-gradient(180deg, #d6e4ff, #f0f5ff 30%, #e8e8e8 100%);
}

.roadmap__section {
  position: relative;
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr);
  column-gap: 24px;
  margin-bottom: 28px;
}

.roadmap__marker {
  position: relative;
  min-height: 24px;
}

.roadmap__body {
  min-width: 0;
}

.dot {
  position: absolute;
  left: 8px;
  top: 8px;
  z-index: 1;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 3px solid #ffffff;
  box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.08);
}

.dot--done {
  background: #52c41a;
}

.dot--active {
  background: #1677ff;
}

.dot--planning {
  background: #d9d9d9;
}

.project-card {
  min-width: 0;
}

.project-card h3 {
  font-size: 26px;
  font-weight: 700;
  line-height: 1.32;
}

.project-card h4 {
  margin: 0 0 10px;
  font-size: 16px;
  font-weight: 700;
  color: #262626;
}

.project-card h5 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #1f1f1f;
}

.head {
  justify-content: space-between;
  align-items: flex-start;
}

.status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
}

.status.is-done {
  color: #389e0d;
  background: #f6ffed;
}

.status.is-active {
  color: #1677ff;
  background: #e6f4ff;
}

.status.is-planning {
  color: #8c8c8c;
  background: #fafafa;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 18px;
}

.panel {
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 18px;
  background: #fcfdff;
}

.panel ul {
  margin: 0;
  padding-left: 18px;
  line-height: 1.9;
  color: #595959;
}

.foot {
  justify-content: space-between;
  margin-top: 16px;
}

.subplans {
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px dashed #ececec;
}

.subplan-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.subplan {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  padding: 16px 18px;
  border: 1px solid #edf1f7;
  border-radius: 18px;
  background: #ffffff;
}

.subplan.is-todo {
  border-color: #ffe58f;
  background: #fffbe6;
}

.subplan.is-done {
  border-color: #d9f7be;
  background: #fcfffc;
}

.subplan.is-doing {
  border-color: #bae0ff;
  background: #f8fbff;
}

@media (max-width: 960px) {
  .hero,
  .admin-grid,
  .grid {
    grid-template-columns: 1fr;
  }

  .roadmap__section {
    grid-template-columns: 28px minmax(0, 1fr);
    column-gap: 16px;
  }

  .subplan,
  .head,
  .foot {
    flex-direction: column;
    align-items: flex-start;
  }

  .card {
    padding: 20px 18px;
  }
}
</style>
