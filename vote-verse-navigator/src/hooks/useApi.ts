import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';

type QueryKeyT = [string, Record<string, unknown>?];

export function useApiQuery<T>(
    queryKey: QueryKeyT,
    apiFunction: () => Promise<AxiosResponse<T>>,
    options?: Omit<UseQueryOptions<AxiosResponse<T>, AxiosError, T>, 'queryKey' | 'queryFn'>
) {
    return useQuery<AxiosResponse<T>, AxiosError, T>({
        queryKey,
        queryFn: apiFunction,
        select: (response) => response.data,
        ...options,
    });
}

export function useApiMutation<TData, TVariables>(
    mutationFunction: (variables: TVariables) => Promise<AxiosResponse<TData>>,
    options?: Omit<UseMutationOptions<AxiosResponse<TData>, AxiosError, TVariables, unknown>, 'mutationFn'>
) {
    return useMutation<AxiosResponse<TData>, AxiosError, TVariables>({
        mutationFn: mutationFunction,
        ...options,
    });
}

// Specific hooks for each API endpoint
import {
    voterAPI,
    positionAPI,
    candidateAPI,
    voteAPI,
    feedbackAPI,
    resultsAPI,
    Voter,
    Position,
    Candidate,
    Vote,
    Feedback,
    VoteResults,
} from '../services/api';

// Voter hooks
export const useVoters = (options?: UseQueryOptions<AxiosResponse<Voter[]>, AxiosError, Voter[]>) =>
    useApiQuery(['voters'], voterAPI.getAllVoters, options);

export const useVoterByRegNo = (regNo: string, options?: UseQueryOptions<AxiosResponse<Voter>, AxiosError, Voter>) =>
    useApiQuery(['voter', { regNo }], () => voterAPI.getVoterByRegNo(regNo), options);

// Position hooks
export const usePositions = (options?: UseQueryOptions<AxiosResponse<Position[]>, AxiosError, Position[]>) =>
    useApiQuery(['positions'], positionAPI.getAllPositions, options);

export const usePositionsByLevel = (level: string, options?: UseQueryOptions<AxiosResponse<Position[]>, AxiosError, Position[]>) =>
    useApiQuery(['positions', { level }], () => positionAPI.getPositionsByLevel(level), options);

// Candidate hooks
export const useCandidates = (options?: UseQueryOptions<AxiosResponse<Candidate[]>, AxiosError, Candidate[]>) =>
    useApiQuery(['candidates'], candidateAPI.getAllCandidates, options);

export const useCandidatesByPosition = (positionId: number, options?: UseQueryOptions<AxiosResponse<Candidate[]>, AxiosError, Candidate[]>) =>
    useApiQuery(['candidates', { positionId }], () => candidateAPI.getCandidatesByPosition(positionId), options);

export const useApprovedCandidates = (options?: UseQueryOptions<AxiosResponse<Candidate[]>, AxiosError, Candidate[]>) =>
    useApiQuery(['candidates', { approved: true }], candidateAPI.getApprovedCandidates, options);

// Vote hooks
export const useVoteResults = (positionId: number, options?: UseQueryOptions<AxiosResponse<VoteResults>, AxiosError, VoteResults>) =>
    useApiQuery(['voteResults', { positionId }], () => voteAPI.getVoteResults(positionId), options);

export const useVoterHistory = (regNo: string, options?: UseQueryOptions<AxiosResponse<Vote[]>, AxiosError, Vote[]>) =>
    useApiQuery(['voterHistory', { regNo }], () => voteAPI.getVoterHistory(regNo), options);

export const useCastVote = (options?: UseMutationOptions<AxiosResponse<Vote>, AxiosError, Omit<Vote, 'id' | 'timestamp' | 'voteHash'>>) =>
    useApiMutation(voteAPI.castVote, options);

// Feedback hooks
export const useFeedback = (options?: UseQueryOptions<AxiosResponse<Feedback[]>, AxiosError, Feedback[]>) =>
    useApiQuery(['feedback'], feedbackAPI.getAllFeedback, options);

export const useFeedbackByVoter = (regNo: string, options?: UseQueryOptions<AxiosResponse<Feedback[]>, AxiosError, Feedback[]>) =>
    useApiQuery(['feedback', { regNo }], () => feedbackAPI.getFeedbackByVoter(regNo), options);

export const useSubmitFeedback = (options?: UseMutationOptions<AxiosResponse<Feedback>, AxiosError, Omit<Feedback, 'id' | 'submissionDate'>>) =>
    useApiMutation(feedbackAPI.submitFeedback, options);

// Results hooks
export const useResultsByPosition = (positionId: number, options?: UseQueryOptions<AxiosResponse<Candidate[]>, AxiosError, Candidate[]>) =>
    useApiQuery(['results', { positionId }], () => resultsAPI.getResultsByPosition(positionId), options);

export const useAllResultsByPosition = (positionId: number, options?: UseQueryOptions<AxiosResponse<Candidate[]>, AxiosError, Candidate[]>) =>
    useApiQuery(['results', { positionId, all: true }], () => resultsAPI.getAllResultsByPosition(positionId), options); 