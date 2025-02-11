<script lang="ts">
	// import Search from '$lib/components/icons/search.svelte';
	import { SearchIcon, ChevronDownIcon, ArrowSmallLeftIcon, ArrowSmallRightIcon, FilterIcon } from 'ui/icons';
	import { Button } from 'ui/button';

	import ModListItem from '$lib/components/ModListItem.svelte';
	import { onMount } from 'svelte';

	enum Sort {
		Newest = "created_at:desc",
		Oldest = "created_at:asc",
		MostPopular = "stats.downloads:desc",
		LeastPopular = "stats.downloads:asc"
	}

	function getSortLabel(sortValue: string): string {
		switch (sortValue) {
			case Sort.Newest:
				return "Newest";
			case Sort.Oldest:
				return "Oldest";
			case Sort.MostPopular:
				return "Most Popular";
			case Sort.LeastPopular:
				return "Least Popular";
			default:
				return sortValue;
		}
	}

	let listHeight;
	let data: any[] = [];
	let sort = Sort.Newest;
	let totalPages = 1;
	let totalHits = 0;
	let currentPage = 1;
	let searchValue: string = ""

	const search = async (q: String) => {
		const res = await (
			await fetch(`https://search.beatforge.net/indexes/${import.meta.env.MEILI_PREFIX}_mods/search`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
					Authorization:
						'Bearer ' + '1bb9363429a821bb444c459fe529505de0c9985a6abb6802c1849797b4ae316b'
				},
				body: JSON.stringify({
					q: q,
					sort: [sort.toString()],
					page: currentPage,
					hitsPerPage: 5,
				})
			})
		).json();
		data = res.hits;
		data = data;
		totalHits = res.totalHits;
		totalPages = res.totalPages;
	};

	const searchOnInput = async (e: any) => {
		await search(<String>(<HTMLInputElement>e.target).value);
		searchValue = e.target.value;
		currentPage = 1;

	};
	const onSortChange = async () => {
		await search('');
		currentPage = 1;
	}

	onMount(async () => {
		await search('');
	});
</script>

<div class="w-full px-6 mx-auto max-w-7xl">
	<div class="beatforge-discover-header-wrapper">
		<h1 class="relative max-w-[700px] text-4xl font-black leading-[1.25] tracking-wide mt-4 z-[2]">Discover</h1>
	</div>

	<div class="flex flex-row gap-4 mt-4 beatforge-discover-filter-wrapper">
		<div
			class="relative flex flex-row items-center w-full overflow-hidden rounded-md bg-primary-800 text-primary-50"
		>
			<SearchIcon customClasses="w-4 h-4 absolute left-4 z-10 select-none pointer-events-none" />
			<input
				on:input={searchOnInput}
				class="flex flex-row items-center w-full gap-2 py-3 pl-12"
				placeholder="Search for mods"
			/>
		</div>

		<div
			class="relative flex flex-row items-center overflow-hidden rounded-md w-14 md:w-2/5 bg-primary-800"
		>
			<div class="absolute hidden -translate-y-1/2 pointer-events-none select-none right-4 top-1/2 md:block">
				<ChevronDownIcon
					customClasses="w-4 h-4 z-10 select-none pointer-events-none"
				/>
			</div>
			<div class="absolute block -translate-y-1/2 pointer-events-none select-none right-4 top-1/2 md:hidden">
				<FilterIcon
					customClasses="w-4 h-4 z-10 select-none pointer-events-none"
				/>
			</div>
			<select class="flex flex-row items-center w-full gap-2 py-3 pl-4 pr-12" bind:value={sort} on:change={onSortChange}>
				<option value={Sort.Newest}>Newest</option>
				<option value={Sort.Oldest}>Oldest</option>
				<option value={Sort.MostPopular}>Most popular</option>
				<option value={Sort.LeastPopular}>Least popular</option>
			</select>
		</div>
	</div>

	<div class="flex justify-center p-2 mt-4 -mb-4 rounded-t-md pagination bg-primary-800">
		<div class="flex overflow-hidden rounded-full">
			<Button
			  variant="unset"
			  on:click={() => {
				currentPage--;
				search(searchValue);
			  }}
			  disabled={currentPage === 1}
			  customClasses="px-3 py-1 rounded-none bg-primary-850 hover:bg-primary-900 text-md font-bold"
			>
			  <ArrowSmallLeftIcon customClasses="w-4 h-4" />
			</Button>
		  
			{#if totalPages <= 5}
			  {#each Array(totalPages) as _, i}
				<Button
				  variant="unset"
				  on:click={() => {
					currentPage = i + 1;
					search(searchValue);
				  }}
				  disabled={currentPage === i + 1}
				  customClasses="px-3 py-1 rounded-none bg-primary-850 hover:bg-primary-900 text-md font-bold"
				>
				  {i + 1}
				</Button>
			  {/each}
			{:else}
			  {#if currentPage <= 2}
				{#each Array(4) as _, i}
				  <Button
					variant="unset"
					on:click={() => {
					  currentPage = i + 1;
					  search(searchValue);
					}}
					disabled={currentPage === i + 1}
					customClasses="px-3 py-1 rounded-none bg-primary-850 hover:bg-primary-900 text-md font-bold"
				  >
					{i + 1}
				  </Button>
				{/each}
				<Button
				  variant="unset"
				  customClasses="px-3 py-1 rounded-none bg-primary-850 hover:bg-primary-900 text-md font-bold"
				>
				  ...
				</Button>
				<Button
				  variant="unset"
				  on:click={() => {
					currentPage = totalPages;
					search(searchValue);
				  }}
				  customClasses="px-3 py-1 rounded-none bg-primary-850 hover:bg-primary-900 text-md font-bold"
				>
				  {totalPages}
				</Button>
			  {:else if currentPage >= totalPages - 2}
				<Button
				  variant="unset"
				  on:click={() => {
					currentPage = 1;
					search(searchValue);
				  }}
				  customClasses="px-3 py-1 rounded-none bg-primary-850 hover:bg-primary-900 text-md font-bold"
				>
				  1
				</Button>
				<Button
				  variant="unset"
				  customClasses="px-3 py-1 rounded-none bg-primary-850 hover:bg-primary-900 text-md font-bold"
				>
				  ...
				</Button>
				{#each Array(4) as _, i}
				  <Button
					variant="unset"
					on:click={() => {
					  currentPage = totalPages - 3 + i;
					  search(searchValue);
					}}
					disabled={currentPage === totalPages - 3 + i}
					customClasses="px-3 py-1 rounded-none bg-primary-850 hover:bg-primary-900 text-md font-bold"
				  >
					{totalPages - 3 + i}
				  </Button>
				{/each}
			  {:else}
				<Button
				  variant="unset"
				  on:click={() => {
					currentPage = 1;
					search(searchValue);
				  }}
				  customClasses="px-3 py-1 rounded-none bg-primary-850 hover:bg-primary-900 text-md font-bold"
				>
				  1
				</Button>
				<Button
				  variant="unset"
				  customClasses="px-3 py-1 rounded-none bg-primary-850 hover:bg-primary-900 text-md font-bold"
				>
				  ...
				</Button>
				{#each Array(2) as _, i}
				  <Button
					variant="unset"
					on:click={() => {
					  currentPage = currentPage - 1 + i;
					  search(searchValue);
					}}
					disabled={currentPage === currentPage - 1 + i}
					customClasses="px-3 py-1 rounded-none bg-primary-850 hover:bg-primary-900 text-md font-bold"
				  >
					{currentPage - 1 + i}
				  </Button>
				{/each}
				<Button
				  variant="unset"
				  customClasses="px-3 py-1 rounded-none bg-primary-850 hover:bg-primary-900 text-md font-bold"
				>
				  ...
				</Button>
				<Button
				  variant="unset"
				  on:click={() => {
					currentPage = totalPages;
					search(searchValue);
				  }}
				  customClasses="px-3 py-1 rounded-none bg-primary-850 hover:bg-primary-900 text-md font-bold"
				>
				  {totalPages}
				</Button>
			  {/if}
			{/if}
		  
			<Button
			  variant="unset"
			  on:click={() => {
				currentPage++;
				search(searchValue);
			  }}
			  disabled={currentPage === totalPages}
			  customClasses="px-3 py-1 rounded-none bg-primary-850 hover:bg-primary-900 text-md font-bold"
			>
			  <ArrowSmallRightIcon customClasses="w-4 h-4" />
			</Button>
		  </div>
	</div>
	<!-- end pagination -->

	<div class="flex mt-4 text-xs font-bold md:hidden">Sorting by<span class="text-[#875CEF] ml-1">{getSortLabel(sort)}</span></div>
	<div class="mt-4 overflow-hidden rounded-b-md beatforge-discover-list-items-wrapper">
		{#if data && data.length}
			{#each data as mod}
				<ModListItem
					name={mod.name}
					slug={mod.slug}
					author={mod.author.username}
					description={mod.description}
					category={mod.category}
					downloads={mod.stats.downloads}
					updatedAt={mod.updated_at}
					icon={mod.icon}
				/>
			{/each}
		{:else}
			<p class="text-center text-primary-300">No mods found</p>
		{/if}
	</div>
	<div class="mt-4 text-xs font-black text-primary-300">
		<p>Total Mods: {totalHits}</p>
	</div>
</div>
