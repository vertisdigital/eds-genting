import { moveInstrumentation } from "../../scripts/scripts.js";
import Heading from "../../shared-components/Heading.js";
import stringToHTML from "../../shared-components/Utility.js";

export default function decorate(block) {
  /*
<div data-aue-re
		source="urn:aemconnection:/content/genting-singapore/index/aboutus-page-blocks/AboutStatistics1/jcr:content/root/section_1854556704/block" data-aue-type="container" data-aue-behavior="component" data-aue-model="statistics" data-aue-label="Statistics" data-aue-filter="statistics" class="statistics block" data-block-name="statistics" data-block-status="loaded">
			<div>
				<div ></div>    
			</div>
			<div data-aue-resource="urn:aemconnection:/content/genting-singapore/index/aboutus-page-blocks/AboutStatistics1/jcr:content/root/section_1854556704/block/item" data-aue-type="component" data-aue-model="featureItem" data-aue-filter="featureItem" data-aue-label="Feature Item">
				<div></div>
				<div></div>
				<div>
					<div data-aue-prop="feature-title" data-aue-label="Feature Title" data-aue-filter="text" data-aue-type="richtext">
						<p>20M</p>
					</div>
				</div>
				<div>
					<p data-aue-prop="feature-heading" data-aue-label="Feature Heading" data-aue-type="text">visitors and counting</p>
				</div>
			</div>
			<div data-aue-resource="urn:aemconnection:/content/genting-singapore/index/aboutus-page-blocks/AboutStatistics1/jcr:content/root/section_1854556704/block/9_1739016880221" data-aue-type="component" data-aue-model="featureItem" data-aue-filter="featureItem" data-aue-label="Feature Item">
				<div></div>
				<div></div>
				<div>
					<div data-aue-prop="feature-title" data-aue-label="Feature Title" data-aue-filter="text" data-aue-type="richtext">
						<p>7K+</p>
					</div>
				</div>
				<div>
					<p data-aue-prop="feature-heading" data-aue-label="Feature Heading" data-aue-type="text">local partners</p>
				</div>
			</div>
			<div data-aue-resource="urn:aemconnection:/content/genting-singapore/index/aboutus-page-blocks/AboutStatistics1/jcr:content/root/section_1854556704/block/10_1739017048762" data-aue-type="component" data-aue-model="featureItem" data-aue-filter="featureItem" data-aue-label="Feature Item">
				<div></div>
				<div></div>
				<div>
					<div data-aue-prop="feature-title" data-aue-label="Feature Title" data-aue-filter="text" data-aue-type="richtext">
						<p>S$14B</p>
					</div>
				</div>
				<div>
					<p data-aue-prop="feature-heading" data-aue-label="Feature Heading" data-aue-type="text">economic value</p>
				</div>
			</div>
			<div data-aue-resource="urn:aemconnection:/content/genting-singapore/index/aboutus-page-blocks/AboutStatistics1/jcr:content/root/section_1854556704/block/11_1739017073766" data-aue-type="component" data-aue-model="featureItem" data-aue-filter="featureItem" data-aue-label="Feature Item">
				<div></div>
				<div></div>
				<div>
					<div data-aue-prop="feature-title" data-aue-label="Feature Title" data-aue-filter="text" data-aue-type="richtext">
						<p>3</p>
					</div>
				</div>
				<div>
					<p data-aue-prop="feature-heading" data-aue-label="Feature Heading" data-aue-type="text">world-class attractions</p>
				</div>
			</div>
			<div data-aue-resource="urn:aemconnection:/content/genting-singapore/index/aboutus-page-blocks/AboutStatistics1/jcr:content/root/section_1854556704/block/item_1461143621" data-aue-type="component" data-aue-model="statisticsDescription" data-aue-filter="statisticsDescription" data-aue-label="Statistics Description">
				<div>
					<p data-aue-prop="title" data-aue-label="Title" data-aue-type="text">About Genting Singapore</p>
				</div>
				<div>
					<div data-aue-prop="description" data-aue-label="Description" data-aue-filter="text" data-aue-type="richtext">
						<p>At Genting Singapore, we’re more than an integrated resort developer and operator. We’re a longstanding partner to the nation and to our communities – driving sustainable growth, creating lasting value and transforming lives through hospitality and tourism.</p>
					</div>
				</div>
				<div>
					<p data-aue-prop="readMoreLabel" data-aue-label="Read More Label" data-aue-type="text">Read More</p>
				</div>
				<div>
					<p data-aue-prop="readLessLabel" data-aue-label="Read Less Label" data-aue-type="text">Read Less</p>
				</div>
			</div>
		</div>
         */

  //finding the feature items
  const featureItems = block.querySelectorAll('[data-aue-model="featureItem"]');

  const featureContainer = document.createElement("div");
  featureContainer.className = "row";

  featureItems.forEach((featureItem) => {
    featureContainer.appendChild(featureItem);
    featureItem.classList.add(
      "col-xl-3",
      "col-lg-3",
      "col-md-3",
      "col-sm-4",
      "feature-item"
    );
    featureItem
      .querySelector('[data-aue-prop="feature-title"]')
      .classList.add("statistic");
    featureItem
      .querySelector('[data-aue-prop="feature-heading"]')
      .classList.add("text-container");
  });
  //insert the feature container as first element
  block.insertBefore(featureContainer, block.firstChild);

  //processing the statistics description block
  const statisticBlock = block.querySelector(
    '[data-aue-model="statisticsDescription"]'
  );
  if (statisticBlock) {
    //replacing the 					<p data-aue-prop="title" data-aue-label="Title" data-aue-type="text">About Genting Singapore</p> with h2
    const titleElement = statisticBlock.querySelector(
      '[data-aue-prop="title"]'
    );
    if (titleElement) {
      const titleText = titleElement.textContent;
      const header = document.createElement("header");
      moveInstrumentation(titleElement, header);
      const titleHtml = Heading({
        level: 2,
        text: titleText,
        className: "statistics-title",
      });
      const parsedHtml = stringToHTML(titleHtml);
      header.append(parsedHtml);
      titleElement.outerHTML = header.outerHTML;
    }

    //adding class  statistics-description to description
    const descriptionElement = statisticBlock.querySelector(
      '[data-aue-prop="description"]'
    );
    if (descriptionElement) {
      descriptionElement.classList.add("statistics-description");
    }

    //adding class to read more and read less
    const readMoreElement = statisticBlock.querySelector(
      '[data-aue-prop="readMoreLabel"]'
    );
    if (readMoreElement) {
      readMoreElement.classList.add("read-more");
    }

    const readLessElement = statisticBlock.querySelector(
      '[data-aue-prop="readLessLabel"]'
    );
    if (readLessElement) {
      readLessElement.classList.add("read-less");
    }
  }
}
