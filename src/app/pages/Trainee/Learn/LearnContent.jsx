// src/app/pages/Trainee/Learn/LearnContent.jsx

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import VideoContent from "./partials/VideoContent";
import ReadingContent from "./partials/ReadingContent";
import QuizContent from "./partials/QuizContent";
import {
	getLearningPartitionByIdAndTraineeId,
	getLearningSectionMaterial,
	markSectionMaterialAsCompleted,
	markSectionMaterialAsNotCompleted,
	getLearningSectionQuiz
} from "../../../apis/Trainee/TraineeLearningApi";

export default function LearnContent() {
	const { courseId, sectionId, partitionId } = useParams();
	const traineeId = 1; // Hardcoded trainee ID

	const [partition, setPartition] = useState(null);
	const [partitionMaterial, setPartitionMaterial] = useState(null);
		const [sectionQuiz, setSectionQuiz] = useState(null);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchPartitionData = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			setPartitionMaterial(null);
			setSectionQuiz(null);

			console.log("Fetching partition:", partitionId);
			const partitionRes = await getLearningPartitionByIdAndTraineeId(partitionId, traineeId);
			console.log("Partition response:", partitionRes);
			setPartition(partitionRes);

			if ([1, 2].includes(partitionRes.partitionType)) {
				console.log("Fetching section material for partition:", partitionId);
				const materialRes = await getLearningSectionMaterial(partitionId, traineeId);
				console.log("Material response:", materialRes);
				setPartitionMaterial(materialRes);
			} else if (partitionRes.partitionType === 3) {
				// Quiz
				console.log("Fetching section quiz for partition:", partitionId);
				const quizRes = await getLearningSectionQuiz(partitionId, traineeId);
				console.log("Quiz response:", quizRes);
				setSectionQuiz(quizRes);
			}
		} catch (err) {
			console.error("Error fetching partition or material or quiz:", err);
			setError("Failed to load learning content. Check console for details.");
		} finally {
			setLoading(false);
		}
	}, [partitionId, traineeId]);

	useEffect(() => {
		fetchPartitionData();
	}, [fetchPartitionData]);

	// handle mark material as complete
	const handleMarkAsComplete = async () => {
		if (!partition || !partitionMaterial) return;
		const success = await markSectionMaterialAsCompleted(partition.sectionPartitionId, traineeId);
		if (success) {
			await fetchPartitionData();
		} else {
			alert("Failed to mark as complete. Please try again.");
		}
	}

	// handle mark material as not complete
	const handleMarkAsNotComplete = async () => {
		if (!partition || !partitionMaterial) return;
		const success = await markSectionMaterialAsNotCompleted(partition.sectionPartitionId, traineeId);
		if (success) {
			await fetchPartitionData();
		} else {
			alert("Failed to mark as not complete. Please try again.");
		}
	}

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

	switch (partition.partitionType) {
		case 1: // Video
			return (
				partitionMaterial && (
					<VideoContent
						title={partitionMaterial.materialName || "Untitled Video"}
						completed={partitionMaterial.isCompleted}
						videoUrl={partitionMaterial.materialUrl}
						onMarkAsComplete={handleMarkAsComplete}
						onMarkAsNotComplete={handleMarkAsNotComplete}
					/>
				)
			);

		case 2: // Document
			return (
				partitionMaterial && (
					<ReadingContent
						title={partitionMaterial.materialName || "Untitled Document"}
						completed={partitionMaterial.isCompleted}
						documentUrl={partitionMaterial.materialUrl}
						onMarkAsComplete={handleMarkAsComplete}
						onMarkAsNotComplete={handleMarkAsNotComplete}
					/>
				)
			);

		case 3: // Quiz
			return (
				sectionQuiz && (
					<QuizContent sectionQuiz={sectionQuiz} />
				)
			);

		default:
			return (
				<div className="text-center py-12">
					<h2 className="text-xl font-semibold text-slate-900 mb-2">
						Unsupported Content Type
					</h2>
					<p className="text-slate-600">
						This type of content (type {partition.partitionType}) is not yet supported.
					</p>
				</div>
			);
	}
}
