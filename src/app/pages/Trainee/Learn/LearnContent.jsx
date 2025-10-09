// src/app/pages/Trainee/Learn/LearnContent.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VideoContent from "./partials/VideoContent";
import {
	getLearningPartitionByIdAndTraineeId,
	getLearningSectionMaterial,
} from "../../../apis/Trainee/TraineeLearningApi";

export default function LearnContent() {
	const { courseId, sectionId, partitionId } = useParams();
	const traineeId = 1; // Hardcoded trainee ID

	const [partition, setPartition] = useState(null);
	const [partitionMaterial, setPartitionMaterial] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				setError(null);

				console.log("Fetching partition:", partitionId);
				const partitionRes = await getLearningPartitionByIdAndTraineeId(partitionId, traineeId);
				console.log("Partition response:", partitionRes);
				setPartition(partitionRes);

				// Only fetch material if it's a video type
				if (partitionRes.partitionType === 1) {
					console.log("Fetching section material for partition:", partitionId);
					const materialRes = await getLearningSectionMaterial(partitionId, traineeId);
					console.log("Material response:", materialRes);
					setPartitionMaterial(materialRes);
				}
			} catch (err) {
				console.error("❌ Error fetching partition or material:", err);
				setError("Failed to load learning content. Check console for details.");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [partitionId, traineeId]);

	if (loading) {
		return (
			<div className="text-center py-12">
				<p className="text-slate-600">Loading content...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center py-12">
				<h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
				<p className="text-slate-600">{error}</p>
			</div>
		);
	}

	if (!partition) {
		return (
			<div className="text-center py-12">
				<h2 className="text-xl font-semibold text-slate-900 mb-2">Content Not Found</h2>
				<p className="text-slate-600">The requested lesson content could not be found.</p>
			</div>
		);
	}

	// Render only video for now
	if (partition.partitionType === 1 && partitionMaterial) {
		return (
			<VideoContent
				title={partitionMaterial.materialName || "Untitled Video"}
				completed={partitionMaterial.isCompleted}
				videoUrl={partitionMaterial.materialUrl}
			/>
		);
	}

	// Unknown type fallback
	return (
		<div className="text-center py-12">
			<h2 className="text-xl font-semibold text-slate-900 mb-2">Unsupported Content Type</h2>
			<p className="text-slate-600">
				This type of content (type {partition.partitionType}) is not yet supported.
			</p>
		</div>
	);
}
