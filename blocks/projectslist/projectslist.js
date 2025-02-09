import { createOptimizedPicture } from "../../scripts/aem.js";

export default function decorate(block) {
  // Add block level attributes for authoring
  block.setAttribute(
    "data-aue-resource",
    "urn:aemconnection:/content/genting-singapore/index/enquiry/jcr:content/root/section/block"
  );
  block.setAttribute("data-aue-type", "container");
  block.setAttribute("data-aue-behavior", "component");
  block.setAttribute("data-aue-model", "projectslist");
  block.setAttribute("data-aue-label", "projectslist");
  block.setAttribute("data-aue-filter", "projectslist");

  // Restructure the HTML for better semantics and accessibility
  const wrapper = block.closest(".projectslist-wrapper");

  // Create single container with all responsive classes
  const container = document.createElement("div");
  container.className = "container-xl container-md container-sm";
  container.setAttribute(
    "data-aue-resource",
    block.getAttribute("data-aue-resource")
  );
  container.setAttribute("data-aue-type", "container");
  container.setAttribute("data-aue-behavior", "component");
  container.setAttribute("data-aue-model", "projectslist");
  container.setAttribute("data-aue-label", "projectslist");
  container.setAttribute("data-aue-filter", "projectslist");

  const projectsContainer = wrapper.querySelector(
    '[data-aue-model="projectslist"]'
  );

  Array.from(projectsContainer.children).map((project) => {
    const projectContainer = document.createElement("div");
    projectContainer.className = "projectslistitem";
    projectContainer.setAttribute(
      "data-aue-resource",
      project.getAttribute("data-aue-resource")
    );
    projectContainer.setAttribute("data-aue-type", "component");
    projectContainer.setAttribute("data-aue-model", "projectslistitem");
    projectContainer.setAttribute("data-aue-label", "projectslistitem");

    // Create left column (heading) - 40% on desktop and tablet
    const leftCol = document.createElement("div");
    leftCol.className = "col-xl-6 col-md-3 container-sm-4";

    const titleText = project.querySelector('[data-aue-prop="title"]');
    if (titleText) {
      const title = document.createElement("p");
      title.className = "project-title";
      title.setAttribute("data-aue-prop", "title");
      title.setAttribute("data-aue-label", "Title");
      title.setAttribute("data-aue-type", "text");
      title.innerHTML = titleText.innerHTML;
      leftCol.appendChild(title);
    }

    const subtitleText = project.querySelector('[data-aue-prop="subtitle"]');
    if (subtitleText) {
      const subtitle = document.createElement("p");
      subtitle.className = "project-subtitle";
      subtitle.setAttribute("data-aue-prop", "subtitle");
      subtitle.setAttribute("data-aue-label", "Subtitle");
      subtitle.setAttribute("data-aue-type", "text");
      subtitle.innerHTML = subtitleText.innerHTML;
      leftCol.appendChild(subtitle);
    }

    const longDescriptionText = project.querySelector(
      '[data-aue-prop="longdescription"]'
    );
    if (longDescriptionText) {
      const longDescription = document.createElement("p");
      longDescription.className = "project-longDescription";
      longDescription.setAttribute("data-aue-prop", "longdescription");
      longDescription.setAttribute("data-aue-label", "Long Description");
      longDescription.setAttribute("data-aue-filter", "text");
      longDescription.setAttribute("data-aue-type", "richtext");
      longDescription.innerHTML = longDescriptionText.innerHTML;
      leftCol.appendChild(longDescription);
    }

    const shortDescriptionText = project.querySelector(
      '[data-aue-prop="shortdescription"]'
    );
    if (shortDescriptionText) {
      const shortDescription = document.createElement("p");
      shortDescription.className = "project-shortDescription";
      shortDescription.setAttribute("data-aue-prop", "shortdescription");
      shortDescription.setAttribute("data-aue-label", "Short Description");
      shortDescription.setAttribute("data-aue-type", "text");
      shortDescription.innerHTML = shortDescriptionText.innerHTML;
      leftCol.appendChild(shortDescription);
    }

    // Create right column (description and contacts) - 60% on desktop and tablet
    const rightCol = document.createElement("div");
    rightCol.className = "col-xl-6 col-md-3 container-sm-4";

    const image = document.createElement("img");
    image.className = "project-image";
    const imageLink = project.querySelector(
      'a[href*="/content/dam/"][href$=".png"], a[href*="/content/dam/"][href$=".jpeg"], a[href*="/content/dam/"][href$=".jpg"], a[href*="/content/dam/"][href$=".gif"], a[href*="/content/dam/"][href$=".svg"]'
    );
    if (imageLink) {
      // const imageUrl = imageLink.getAttribute("href");
      const imageUrl =
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtnvAOajH9gS4C30cRF7rD_voaTAKly2Ntaw&s";
      const imageAlt = imageLink.getAttribute("title") || "Project Image";
      const picture = createOptimizedPicture(imageUrl, "", false);
      // Remove original link
      imageLink.remove();
      if (picture) {
        const img = document.createElement("img");
        img.className = "project-image";
        img.src =
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtnvAOajH9gS4C30cRF7rD_voaTAKly2Ntaw&s"; // Replace with your image URL
        rightCol.appendChild(img);
      }
    }
    projectContainer.appendChild(leftCol);
    projectContainer.appendChild(rightCol);
    container.appendChild(projectContainer);
  });
  /*
    <div class="grid-container">
  <div class="grid-item">
    <h2>Illumination's Minion Land</h2>
    <p>Illumination's Minion Land will transport guests in Southeast Asia into an immersive, new land inspired by Illumination's beloved Despicable Me and Minions franchise. The highly anticipated land will feature multiple rides, including Despicable Me Minion Mayhem and an all-new carousel exclusive to Universal Studios Singapore, Buggie Boogie, which features dance music remixed by the Minions, as well as a variety of themed retail and dining experiences.</p>
    <p>Soft open: 1Q 2025 (Feb 2025)</p>
    <img src="minion-land.jpg" alt="Minion Land">
  </div>
  <div class="grid-item">
    <h2>Singapore Oceanarium</h2>
    <p>Singapore's new Oceanarium (SGO), a first-class institution that champions marine education and protection of our environment, will be three times larger than the current S.E.A. Aquarium. It will provide a cutting-edge, immersive experience showcasing ocean evolution, fascinating oceanic zones such as the largely unexplored deep ocean, as well as unique representations of Singapore's coastal ecosystems. A carbon-neutral Research and Learning Centre will offer advanced facilities for research, education, and community outreach, fostering marine science innovation and inspiring ocean conservation.</p>
    <p>Soft open: 1H 2025</p>
    <img src="oceanarium.jpg" alt="Singapore Oceanarium">
  </div>
</div>
    */
  // Replace original content
  wrapper.innerHTML = "";
  wrapper.appendChild(container);
}
