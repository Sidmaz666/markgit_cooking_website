const git_owner = 'sidmaz666'
const git_repo = 'markgit_cooking_website_repo'
const popular_recipe = 'popular'
const MG = MarkGit
let title_content_html = []

function renderHTML(targetClass,html){
  document.querySelector(`#${targetClass}`)
    .insertAdjacentHTML(
      "beforeend",
       html
    )
}

function renderRecipe(targetRecipe){

  if(document.querySelector('#render > #recipe-instructions')){
    document.querySelector('#render-recipe-container > #render').removeChild(
    document.querySelector('#render > #recipe-instructions')
  )
}
  
  title_content_html.forEach((recipe) => {
    if(recipe.title == targetRecipe){
      document.querySelector(`#render-recipe-container > #render`)
    .insertAdjacentHTML(
      "beforeend",
      `
		<div id="recipe-instructions">
		${recipe.content_html}
		</div>`
    )
      document.querySelector('#homepage').classList.toggle('hidden')
      document.querySelector('#render-recipe-container').classList.toggle('hidden')
    }
  })
}


async function renderCards(path){
  title_content_html = []
  const fetch_list = await MG.getList(
    git_owner, git_repo, popular_recipe
  )
  fetch_list.forEach(async (name) => {
    if(typeof name !== 'object'){
      const {content_html} = await MG.getContent(
	git_owner,
	git_repo,
	`${path}${name}`
      )

      const parser = new DOMParser()
	.parseFromString(content_html,'text/html')
      const image_link = parser.querySelector('img.banner-image').src

	const title_clean = name.replace('.md','').replaceAll('_',' ')

      const HTMLString = `
 	<div>
	  <button class="w-[200px] h-[200px] hover:scale-[1.05]"
	   onclick="
	   renderRecipe('${name.replace(".md","")}');
	   document.title =  '${name.replace('.md',' ').replaceAll('_',' ').toUpperCase()}'
	   "
	  >
		<img 
	     	class="w-[200px] h-[200px]"
		src="${image_link}">
		<span class="capitalize text-lg font-semibold flex justify-start p-2 bg-[#1c1c26]">
		${title_clean}
		</span>
	  </button>
	</div>
      `

      title_content_html.push({
	title: name.replace('.md',''),
	content_html
      })

      document.querySelector('#recipe-type').textContent = "Popular"
      renderHTML('popular-recipe', HTMLString)

    }
  })
}

async function search_recipe(keyword){
  if(keyword.length > 3){
    const search_req = await MG.search(keyword,git_owner,git_repo)
    if(search_req.status == 'false'){
      document.querySelector('#message')
	.textContent = "Nothing Found as " + keyword + "!"
      document.querySelector('#message').classList.add('text-red-300')
      document.querySelector('#message').classList.toggle('hidden')
    } else {
       while (document.querySelector('#popular-recipe').hasChildNodes()){
               document.querySelector('#popular-recipe')
	   	.removeChild(document.querySelector('#popular-recipe')
		  .firstChild
		)
               }
     title_content_html = []
     document.title = "MarkGit | Search"
     const searched_data = search_req[1]
      searched_data.forEach(async (obj) => {
	const {file_path,filename} = obj
	const {content_html} = await MG.getContent(
		git_owner,git_repo,file_path
	)
      const parser = new DOMParser()
	.parseFromString(content_html,'text/html')
      const image_link = parser.querySelector('img.banner-image').src

	const title_clean = filename.replace('.md','').replaceAll('_',' ')

      const HTMLString = `
 	<div>
	  <button class="w-[200px] h-[200px] hover:scale-[1.05]"
	   onclick="
	   renderRecipe('${filename.replace(".md","")}');
	   document.title =  '${filename.replace('.md',' ').replaceAll('_',' ').toUpperCase()} | Search'
	   "
	  >
		<img 
	     	class="w-[200px] h-[200px]"
		src="${image_link}">
		<span class="capitalize text-lg font-semibold flex justify-start p-2 bg-[#1c1c26]">
		${title_clean}
		</span>
	  </button>
	</div>
      `

      title_content_html.push({
	title: filename.replace('.md',''),
	content_html
      })

      document.querySelector('#recipe-type').textContent = "Search Result: " + keyword
      renderHTML('popular-recipe', HTMLString)
      
      })
    }
  }
} 

window.onload = async function(){
  renderCards(`${popular_recipe}/`)
}

