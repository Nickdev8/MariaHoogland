<script lang="ts">
  import { onMount } from 'svelte';
  import { goto, invalidateAll } from '$app/navigation';

  let projects: any[] = [];
  let newProject: any = { slug: '', category: '', title: '', subtitle: '', description: '', mainImage: '', caption: '', gallery: [] };
  let editingIndex: number | null = null;

  onMount(async () => {
    await loadProjects();
  });

  async function loadProjects() {
    const res = await fetch('/admin/projects');
    projects = await res.json();
  }

  async function saveProject(project: any) {
    const res = await fetch('/admin/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(project)
    });
    if (res.ok) {
      await loadProjects();
      editingIndex = null;
      newProject = { slug: '', category: '', title: '', subtitle: '', description: '', mainImage: '', caption: '', gallery: [] };
    } else {
      alert('Failed to save project');
    }
  }

  function editProject(index: number) {
    editingIndex = index;
    newProject = { ...projects[index] };
  }

  async function deleteProject(slug: string) {
    if (confirm('Are you sure you want to delete this project?')) {
      const res = await fetch('/admin/projects', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ slug })
      });
      if (res.ok) {
        await loadProjects();
        invalidateAll();
      } else {
        alert('Failed to delete project');
      }
    }
  }

  function addGalleryImage() {
    if (newProject.gallery) {
      newProject.gallery = [...newProject.gallery, ''];
    } else {
      newProject.gallery = [''];
    }
  }

  function updateGalleryImage(index: number, value: string) {
    if (newProject.gallery) {
      newProject.gallery[index] = value;
    }
  }

  function removeGalleryImage(index: number) {
    if (newProject.gallery) {
      newProject.gallery = newProject.gallery.filter((_: any, i: number) => i !== index);
    }
  }
</script>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">Project Admin</h1>

  <div class="mb-8">
    <h2 class="text-xl font-semibold mb-2">{editingIndex !== null ? 'Edit Project' : 'Add New Project'}</h2>
    <form on:submit|preventDefault={() => saveProject(newProject)} class="space-y-4">
      <div>
        <label for="slug" class="block text-sm font-medium text-gray-700">Slug</label>
        <input type="text" id="slug" bind:value={newProject.slug} required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
      <div>
        <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
        <input type="text" id="category" bind:value={newProject.category} required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
        <input type="text" id="title" bind:value={newProject.title} required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
      <div>
        <label for="subtitle" class="block text-sm font-medium text-gray-700">Subtitle</label>
        <input type="text" id="subtitle" bind:value={newProject.subtitle} required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
        <textarea id="description" bind:value={newProject.description} required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
      </div>
      <div>
        <label for="mainImage" class="block text-sm font-medium text-gray-700">Main Image URL</label>
        <input type="text" id="mainImage" bind:value={newProject.mainImage} required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
      <div>
        <label for="caption" class="block text-sm font-medium text-gray-700">Caption</label>
        <input type="text" id="caption" bind:value={newProject.caption} class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
      <div>
        <h3 class="text-lg font-medium text-gray-700 mb-2">Gallery Images</h3>
        {#each newProject.gallery || [] as image, i}
          <div class="flex space-x-2 mb-2">
            <input type="text" bind:value={newProject.gallery[i]} class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            <button type="button" on:click={() => removeGalleryImage(i)} class="px-3 py-1 bg-red-500 text-white rounded-md">Remove</button>
          </div>
        {/each}
        <button type="button" on:click={addGalleryImage} class="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md">Add Gallery Image</button>
      </div>
      <button type="submit" class="px-4 py-2 bg-green-500 text-white rounded-md">Save Project</button>
    </form>
  </div>

  <h2 class="text-xl font-semibold mb-2">Existing Projects</h2>
  <div class="overflow-x-auto">
    <table class="min-w-full bg-white border border-gray-200">
      <thead>
        <tr>
          <th class="py-2 px-4 border-b">Title</th>
          <th class="py-2 px-4 border-b">Category</th>
          <th class="py-2 px-4 border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each projects as project, i}
          <tr>
            <td class="py-2 px-4 border-b">{project.title}</td>
            <td class="py-2 px-4 border-b">{project.category}</td>
            <td class="py-2 px-4 border-b">
              <button on:click={() => editProject(i)} class="px-3 py-1 bg-yellow-500 text-white rounded-md mr-2">Edit</button>
              <button on:click={() => deleteProject(project.slug)} class="px-3 py-1 bg-red-500 text-white rounded-md">Delete</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
